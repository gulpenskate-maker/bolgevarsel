export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const sessionEmail = req.cookies.get('bv_session')?.value
  if (!sessionEmail) return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data: sub } = await supabase.from('bv_subscribers').select('id, email, plan').eq('email', sessionEmail).maybeSingle()
  if (!sub || sub.plan !== 'sikkerhet') return NextResponse.json({ error: 'Krever sikkerhet-plan' }, { status: 403 })

  const body = await req.json()
  const { lat, lng, location_name, alert_type = 'manual_sos' } = body

  // Hent aktive nødkontakter
  const { data: contacts } = await supabase
    .from('bv_emergency_contacts')
    .select('*')
    .eq('subscriber_id', sub.id)
    .eq('active', true)

  if (!contacts || contacts.length === 0) {
    return NextResponse.json({ error: 'Ingen nødkontakter registrert' }, { status: 400 })
  }

  const contactsNotified: any[] = []
  const callIds: string[] = []

  // Send SMS til alle nødkontakter via 46elks
  const elksAuth = Buffer.from(`${process.env.ELKS_API_USER}:${process.env.ELKS_API_SECRET}`).toString('base64')

  for (const contact of contacts) {
    const smsMessage = `NODVARSEL fra Bolgevarsel: ${sub.email} har utlost et nodsignal.${location_name ? ` Posisjon: ${location_name}` : ''}${lat && lng ? ` (${lat}, ${lng})` : ''}. Ta kontakt med nodetater umiddelbart, husk a lagre koordinatene! (OBS: Dette er kun en test av nodvarsel-funksjonen)`

    try {
      const smsRes = await fetch('https://api.46elks.com/a1/sms', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${elksAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          from: 'Bolgevarsel',
          to: contact.phone,
          message: smsMessage,
        }),
      })
      const smsData = await smsRes.json()

      contactsNotified.push({
        name: contact.name,
        phone: contact.phone,
        method: 'sms',
        status: smsData.status || 'sent',
      })
      if (smsData.id) callIds.push(smsData.id)

      // Også ring med talemelding - 30 sek delay etter SMS
      const voiceMessage = `Hei ${contact.name}. Dette er et noedvarsel fra Boelgevarsel. ${sub.email} har utloest et noedsignal.${location_name ? ` Sist kjente posisjon er ${location_name}.` : ''} Ta kontakt med noedetater umiddelbart. Husk aa lagre koordinatene fra SMS-en. Gjenta: dette er et noedvarsel. Merk: dette er kun en test av noedvarsel-funksjonen.`

      // Sanitize voice message - fjern tegn som kan brekke JSON
      const safeVoiceMessage = voiceMessage.replace(/["\\\n\r\t]/g, ' ').replace(/\s+/g, ' ')

      // Vent 30 sekunder slik at mottaker kan lese SMS forst
      await new Promise(resolve => setTimeout(resolve, 30000))

      try {
        const voiceRes = await fetch('https://api.46elks.com/a1/calls', {
          method: 'POST',
          headers: { 'Authorization': `Basic ${elksAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            from: process.env.ELKS_FROM_NUMBER || '+4600700072',
            to: contact.phone,
            voice_start: `{"say":"${safeVoiceMessage}","lang":"no"}`,
          }),
        })
        const voiceData = await voiceRes.json()
        console.log('46elks voice status:', voiceRes.status, JSON.stringify(voiceData))

        contactsNotified.push({
          name: contact.name,
          phone: contact.phone,
          method: 'voice_call',
          status: voiceData.state || voiceData.error || 'unknown',
        })
        if (voiceData.id) callIds.push(voiceData.id)
      } catch (voiceErr: any) {
        console.error('Voice call failed:', voiceErr.message)
        contactsNotified.push({
          name: contact.name,
          phone: contact.phone,
          method: 'voice_call',
          status: 'failed',
          error: voiceErr.message,
        })
      }

    } catch (err: any) {
      contactsNotified.push({
        name: contact.name,
        phone: contact.phone,
        method: 'sms',
        status: 'failed',
        error: err.message,
      })
    }
  }

  // Logg alert i databasen
  const { data: alert, error } = await supabase
    .from('bv_emergency_alerts')
    .insert({
      subscriber_id: sub.id,
      alert_type,
      location_lat: lat || null,
      location_lng: lng || null,
      location_name: location_name || null,
      contacts_notified: contactsNotified,
      call_ids: callIds,
      status: 'delivered',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message, contacts_notified: contactsNotified }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    alert_id: alert.id,
    contacts_notified: contactsNotified.length,
    details: contactsNotified,
  })
}
