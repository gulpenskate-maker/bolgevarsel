// Gjenbrukbar SVG-logo komponent
// Bruk: <Logo /> (lys), <Logo dark /> (mørk/hvit), <Logo size={120} />

type Props = {
  dark?: boolean   // hvit tekst for mørk bakgrunn
  size?: number    // bredde i px, høyde skaleres proporsjonalt
}

export default function Logo({ dark = false, size = 180 }: Props) {
  const height = Math.round(size * (30 / 180))
  const fill = dark ? 'white' : '#0a2a3d'
  const wave1 = dark ? 'white' : '#0a2a3d'
  const wave2 = dark ? 'rgba(125,211,240,0.55)' : '#1a6080'
  const no = dark ? '#7dd3fc' : '#1a6080'

  return (
    <svg width={size} height={height} viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke={wave1} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke={wave2} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
      <text x="52" y="30" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="23" fontWeight="600" fill={fill} letterSpacing="-0.8">
        bølgevarsel<tspan fill={no} fontWeight="400">.no</tspan>
      </text>
    </svg>
  )
}
