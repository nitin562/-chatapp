import React from 'react'

export default function MessageTile({msg}) {
    const you=localStorage.getItem("u_name")
  return (
    <div className={`flex items-center ${msg.sender_uname==you?"justify-end":""}`}>
        
    </div>
  )
}
