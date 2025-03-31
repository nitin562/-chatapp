import {Routes,Route, useParams} from "react-router-dom"
import React, { useState } from 'react'
import NavigationSideBar from "../SideBars/NavigationSideBar"
import DataSideBar from "../SideBars/DataSideBar"
import MessageArea from "../Message/MessageArea"


export default function LoadedDashboard() {
    const [menu, setmenu] = useState(1)
    const param=useParams()
  return (
    <div className='bg-gray-900 w-screen h-screen overflow-hidden  flex flex-col md:flex-row-reverse'>
      {/* this is for desktop */}
      <div className='md:flex w-[calc(100%-5rem)] hidden'>
        <DataSideBar menu={menu}/>
        <Routes key={"desk"}>
          <Route path="/message/:id" element={<MessageArea/>}/>
        </Routes>
      </div>
      {/* this is for mobile */}
      <div className='md:hidden  flex flex-1 overflow-hidden'>
        <Routes key={"mobile"}>
          <Route path="/" element={<DataSideBar menu={menu}/>}/>
          <Route  path="/message/:id" element={<MessageArea/>}/>
        </Routes>
      </div>
      <NavigationSideBar menu={menu} setmenu={setmenu}/>

    </div>
  )
}
