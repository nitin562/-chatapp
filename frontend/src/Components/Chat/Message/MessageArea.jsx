import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function MessageArea() {
  const allMessage=useSelector(state=>state.messages.messages)
  const selectedContact=useSelector(state=>state.contact.selected)
  const [messages, setmessages] = useState([])
  useEffect(()=>{
    const key=`${selectedContact.type}${selectedContact.id}`
    const deepCopy=JSON.parse(JSON.stringify(allMessage[key]||[]))
    setmessages(deepCopy)
    
  },[selectedContact])
  useEffect(()=>{
    console.log(messages,"changes")
  },[messages])
  return (
    <div className='flex-1'>
      
    </div>
  )
}
