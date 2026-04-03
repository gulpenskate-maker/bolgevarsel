import { Suspense } from 'react'
import RegistrerForm from './RegistrerForm'

export default function Registrer() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>Laster...</div>}>
      <RegistrerForm />
    </Suspense>
  )
}
