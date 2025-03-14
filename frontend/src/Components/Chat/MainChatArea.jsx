import {Routes,Route} from "react-router-dom"
import React, { useState } from 'react'
import NavigationSideBar from './SideBars/NavigationSideBar'
import DataSideBar from './SideBars/DataSideBar'
import MessageArea from "./MessageArea"

export default function MainChatArea() {
  const [menu, setmenu] = useState(1)
  return (
    <div className='bg-gray-900 w-screen h-screen flex flex-col-reverse md:flex-row'>
      <NavigationSideBar menu={menu} setmenu={setmenu}/>
      <div className='md:flex flex-1 hidden'>
        <DataSideBar menu={menu}/>
        <Routes>
          <Route path="/:id" element={<MessageArea/>}/>
        </Routes>
      </div>
      <div className='md:hidden flex-1 flex'>
        <Routes>
          <Route path="/" element={<DataSideBar menu={menu}/>}/>
          <Route path="/:id" element={<MessageArea/>}/>
        </Routes>
      </div>
    </div>
  )
}
