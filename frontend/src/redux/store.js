import { configureStore } from '@reduxjs/toolkit'
import Userreducer from './userSlice'

export const store = configureStore({
  reducer: {
    user:Userreducer
  },
})