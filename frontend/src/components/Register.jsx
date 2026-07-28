import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import api from '../utlis/axios'
import { auth, googleProvider } from '../utlis/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setuserData } from '../redux/userSlice'


export default function Register() {
  const {userdata}=useSelector((state)=>(state.user))
  const dispatch=useDispatch()
  const HendleData=async(token)=>{
  try {
    const {data}=await api.post("/auth/login",{token})
    dispatch(setuserData(data))
  } catch (error) {
    console.log(error)
  }
  }
  const HendLogin= async()=>{
   const data=await signInWithPopup(auth,googleProvider)
   const token=await data.user.getIdToken()
   await HendleData(token)
    console.log(token)
  }
  return (
    <div>
      {userdata ? <> 
      <div>{userdata.name}</div>
      </> :
      <div> <button onClick={HendLogin}>Continue with google</button></div>
      }
    
    </div>
  )
}
