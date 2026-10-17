import { configureStore } from '@reduxjs/toolkit'
import Userreducer from './userSlice'
import Conversationreducer from './conversationSlice'
import Messagereducer from './messageslice'
import Resumereducer from './ResumeSlice'
import CVreducer from './cvSlice'
import portfolioreducer from './portfolioSlice'
import filereducer from "./fileSlice";

export const store = configureStore({
  reducer: {
    user:Userreducer,
    conversation: Conversationreducer,
    message:Messagereducer,
    resume:Resumereducer,
     cv: CVreducer,
     portfolio: portfolioreducer,
     file: filereducer,
  },
})
  