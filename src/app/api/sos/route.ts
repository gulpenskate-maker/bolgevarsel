export const dynamic = 'force-dynamic'
export const maxDuration = 25
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// GET eller POST: Trigger SOS via webhook-token
// Bruk: GET /api/sos?token=xxx eller POST /api/sos med { token: "xxx" }
// Valgfrie params: lat, lng, location_name
export async function GET(req: NextRequest) {
  return handleSOS(req)
}
export async function POST(req: NextRequest) {
  return handleSOS(req)
}

async function handleSOS(req: NextRequest) {
  // Hent token fra query params eller body
  let token = req.nextUrl.searchParams.get('token')
  let lat = req.nextUrl.searchParams.get('lat')
  let lng = req.nextUrl.searchParams.get('lng')
  let locationName = req.nextUrl.searchParams.get('location') || ''

  if (req.method === 'POST') {
    try {
      const body = await req.json()
      token = body.token || token
      lat = body.lat || lat
      lng = body.lng || lng
      locationName = body.location || body.location_name || locationName
    } catch {}
  }

  if (!token) {
    return NextResponse.json({ error: 'Mangler token' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // Finn subscriber via token
  const { data: sub } = await supabase
    .from('bv_subscribers')
    .select('id, email, plan')
    .eq('sos_token', token)
    .eq('plan', 'sikkerhet')
    .maybeSingle()

  if (!sub) {
    return NextResponse.json({ error: 'Ugyldig token eller ikke sikkerhet-plan' }, { status: 403 })
  }

  // Hent aktive nodkontakter
  const { data: contacts } = await supabase
    .from('bv_emergency_contacts')
    .select('*')
    .eq('subscriber_id', sub.id)
    .eq('active', true)

  if (!contacts || contacts.length === 0) {
    return NextResponse.json({ error: 'Ingen nodkontakter registrert' }, { status: 400 })
  }

  // Hvis ingen posisjon, bruk forste registrerte lokasjon
  if (!lat || !lng) {
    const { data: locs } = await supabase
      .from('bv_locations')
      .select('*')
      .eq('subscriber_id', sub.id)
      .limit(1)
    if (locs?.[0]) {
      lat = String(locs[0].lat)
      lng = String(locs[0].lon)
      locationName = locationName || locs[0].name + ' (registrert lokasjon)'
    }
  }

  const contactsNotified: any[] = []
  const callIds: string[] = []
  const elksAuth = Buffer.from(`${process.env.ELKS_API_USER}:${process.env.ELKS_API_SECRET}`).toString('base64')

  for (const contact of contacts) {
    // SMS
    const smsMessage = `NODVARSEL fra Bolgevarsel: ${sub.email} har utlost et nodsignal.${locationName ? ` Posisjon: ${locationName}` : ''}${lat && lng ? ` (${lat}, ${lng})` : ''}. Ta kontakt med nodetater umiddelbart, husk a lagre koordinatene! Ring Bolgevarsel: +4740093494. (OBS: Dette er kun en test av nodvarsel-funksjonen)`

    try {
      const smsRes = await fetch('https://api.46elks.com/a1/sms', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${elksAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ from: 'Bolgevarsel', to: contact.phone, message: smsMessage }),
      })
      const smsData = await smsRes.json()
      contactsNotified.push({ name: contact.name, phone: contact.phone, method: 'sms', status: smsData.status || 'sent' })
      if (smsData.id) callIds.push(smsData.id)
    } catch {}

    // Voice via ElevenLabs TTS
    const voiceMessage = `Hei ${contact.name}. Dette er et nødvarsel fra Bølgevarsel. Brukeren ${sub.email} har utløst et nødsignal via posisjon.${locationName ? ` Sist kjente posisjon er ${locationName}.` : ''} Husk å lagre koordinatene fra SMS-en. Trykk 1 for å bli koblet direkte til et menneske hos operasjonssentralen hos Bølgevarsel. Merk: dette er kun en test av nødvarsel-funksjonen.`
    const safeVoiceMessage = voiceMessage.replace(/["\\\n\r\t]/g, ' ').replace(/\s+/g, ' ')

    let audioUrl = ''
    try {
      const ttsRes = await fetch('https://api.elevenlabs.io/v1/text-to-speech/s2xtA7B2CTXPPlJzch1v', {
        method: 'POST',
        headers: { 'xi-api-key': 'sk_b9d92350f9d2b18004984778b9cb6929887da6e49e7d068b', 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: safeVoiceMessage, model_id: 'eleven_flash_v2_5', voice_settings: { stability: 0.75, similarity_boost: 0.75, speed: 1.1 }, apply_text_normalization: 'on' }),
      })
      if (ttsRes.ok) {
        const audioBuffer = Buffer.from(await ttsRes.arrayBuffer())
        const formData = new FormData()
        formData.append('files[]', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'sos.mp3')
        const uploadRes = await fetch('https://uguu.se/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json() as any
        audioUrl = uploadData?.files?.[0]?.url || ''
      }
    } catch {}

    // Vent 5 sek mellom SMS og oppringning
    await new Promise(resolve => setTimeout(resolve, 5000))

    try {
      const voiceRes = await fetch('https://api.46elks.com/a1/calls', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${elksAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          from: process.env.ELKS_FROM_NUMBER || '+4600700072',
          to: contact.phone,
          voice_start: audioUrl
            ? JSON.stringify({ ivr: audioUrl, digits: 1, timeout: 30, '1': { connect: '+4740093494' } })
            : `{"say":"${safeVoiceMessage}","lang":"no"}`,
        }),
      })
      const voiceText = await voiceRes.text()
      let voiceData: any = {}
      try { voiceData = JSON.parse(voiceText) } catch { voiceData = { error: voiceText } }
      contactsNotified.push({ name: contact.name, phone: contact.phone, method: 'voice_call', status: voiceData.state || voiceData.error || 'unknown' })
      if (voiceData.id) callIds.push(voiceData.id)
    } catch (voiceErr: any) {
      contactsNotified.push({ name: contact.name, phone: contact.phone, method: 'voice_call', status: 'failed', error: voiceErr.message })
    }
  }

  // Logg i database
  await supabase.from('bv_emergency_alerts').insert({
    subscriber_id: sub.id,
    alert_type: 'manual_sos',
    location_lat: lat ? parseFloat(lat) : null,
    location_lng: lng ? parseFloat(lng) : null,
    location_name: locationName || null,
    contacts_notified: contactsNotified,
    call_ids: callIds,
    status: 'delivered',
  })

  return NextResponse.json({
    success: true,
    contacts_notified: contactsNotified.length,
    message: `SOS utlost for ${sub.email}. ${contacts.length} kontakter varslet.`,
  })
}
