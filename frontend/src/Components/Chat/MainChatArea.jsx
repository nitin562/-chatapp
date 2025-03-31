import React, { useState } from 'react'
import PreLoading from './Dashboard/PreLoading'
import LoadedDashboard from './Dashboard/LoadedDashboard'

export default function MainChatArea() {

  const [preloading, setpreloading] = useState(true)
  return (
    <>
      {preloading&&<PreLoading setPreloading={setpreloading}/>}
      {!preloading && <LoadedDashboard/>}
    </>
  )
}
