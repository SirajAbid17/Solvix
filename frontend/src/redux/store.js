import { configureStore } from '@reduxjs/toolkit'
import Userreducer from './userSlice'
import Conversationreducer from './conversationSlice'
import Messagereducer from './messageslice'

export const store = configureStore({
  reducer: {
    user:Userreducer,
    conversation: Conversationreducer,
    message:Messagereducer
  },
})
  