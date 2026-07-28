import React from 'react'
import { useNavigate } from 'react-router-dom'
import BgContextBtn from '../components/BgContextBtn'

export default function Page_not_Found() {
    const navigate=useNavigate()
    const Hend=()=>{
navigate('/')
    }
  return (
    <div>
        <BgContextBtn/>
      <h1>page not found</h1>
      <button onClick={Hend}>Back to Home</button>
    </div>
  )
}
