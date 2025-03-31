import React, { useEffect, useState } from "react";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { HiOutlineStatusOnline } from "react-icons/hi";
import IconBadge from "../../../Utils/IconBadge";
import { Avatar } from "@chakra-ui/react";
import { completeUrl } from "../../../links";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function NavigationSideBar({menu,setmenu}) {
 
  const user=useSelector(state=>state.user.user)
  const nav=useNavigate()
 
  const selectTab=(val)=>{
    return()=>{
      setmenu(val)
      nav("/chat")
    }
    }
  return (
    <div className="flex flex-row md:flex-col bg-slate-800 w-full md:w-[5rem]   md:h-full px-4 py-1 md:py-6 justify-between items-center">
      <div className="flex flex-row md:flex-col items-center gap-8 *:w-[2rem] *:h-[2rem]  *:md:w-[3rem] *:md:h-[3rem]">
        <div className="relative flex items-center justify-center cursor-pointer  rounded-full" onClick={selectTab(1)} style={{backgroundColor:`${menu==1?"#ffffff":"transparent"}`}}>
          <BsFillChatLeftTextFill className=" text-xl md:text-2xl " style={{color:`${menu==1?"#000":"#fff"}`}}/>
          <IconBadge name="message" />
        </div>
        <div className="relative flex items-center justify-center cursor-pointer bg-white/10 rounded-full" onClick={selectTab(2)} style={{backgroundColor:`${menu==2?"#ffffff":"transparent"}`}}>
          <HiOutlineStatusOnline className="text-gray-400 text-3xl " style={{color:`${menu==2?"#000":"#fff"}`}}/>
          <IconBadge name="status" />
        </div>
      </div>
      <Avatar key={user.demographic?.profile_pic} title="View Profile" cursor="pointer"  src={user.demographic?.profile_pic?completeUrl(user.demographic?.profile_pic):""} className="border-2 border-transparent" onClick={selectTab(0)} style={{borderColor:`${menu==0?"#ffffff":"transparent"}`}}/>
    </div>
  );
}
