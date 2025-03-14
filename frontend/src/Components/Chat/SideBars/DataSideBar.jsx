import React from 'react'
import Profile from './Menu/Profile'

export default function DataSideBar({menu}) {
  return (
    <div className='h-full w-full md:w-[30%] bg-gray-950/70'>
      {menu==0&&<Profile/>}
    </div>
  )
}
