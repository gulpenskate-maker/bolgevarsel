// BarentsWatch Waveforecast API client
// Docs: https://www.barentswatch.no/bwapi/openapi/index.html?urls.primaryName=Waveforecast+API
// Auth: OAuth2 client_credentials via https://id.barentswatch.no/connect/token

const TOKEN_URL = 'https://id.barentswatch.no/connect/token'
const API_BASE = 'https://www.barentswatch.no/bwapi'

export type BwWavePoint = {
  totalSignificantWaveHeight: number | null
  expectedMaximumWaveHeight: number | null
  totalMeanWaveDirection: number | null
  totalPeakPeriod: number | null
  forecastTime: string | null
  latitude: number
  longitude: number
}

export type BwWindPoint = {
  windSpeed: number | null
  windDirection: number | null
  windSpeedOfGust: number | null
  forecastTime: string | null
  latitude: number
  longitude: number
}

export type BwForecast = {
  wave: BwWavePoint[]
  wind: BwWindPoint[]
}

// In-memory token cache (shared across requests within same serverless instance)
let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const clientId = process.env.BARENTSWATCH_CLIENT_ID
  const clientSecret = process.env.BARENTSWATCH_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('BARENTSWATCH_CLIENT_ID og BARENTSWATCH_CLIENT_SECRET må settes')
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'api',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`BarentsWatch token feil (${res.status}): ${text}`)
  }

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    // Expire 5 min early to avoid edge cases
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  }
  return cachedToken.token
}

async function bwFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const token = await getAccessToken()
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}${path}?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 204) return [] as unknown as T
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`BarentsWatch API feil (${res.status}): ${text}`)
  }
  return res.json()
}

export async function fetchBarentsWatchForecast(lat: number, lon: number): Promise<BwForecast> {
  const params = { x: lon.toString(), y: lat.toString() }

  const [wave, wind] = await Promise.all([
    bwFetch<BwWavePoint[]>('/v1/waveforecastpoint/nearest/all', params).catch(() => [] as BwWavePoint[]),
    bwFetch<BwWindPoint[]>('/v1/windforecastpoint/nearest/all', params).catch(() => [] as BwWindPoint[]),
  ])

  return { wave, wind }
}
