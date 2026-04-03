export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import RegistrerForm from './RegistrerForm'

export default function Registrer() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'sans-serif',color:'#2c4a5e'}}>Laster...</div>}>
      <RegistrerForm />
    </Suspense>
  )
}
