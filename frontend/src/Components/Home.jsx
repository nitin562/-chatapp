import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './User/Login'
import Register from './User/Register'
import MainChatArea from './Chat/MainChatArea'


export default function Home() {
  return (
    <>
    <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/chat' element={<MainChatArea/>}/>

    </Routes>
    </>
    
  )
}
