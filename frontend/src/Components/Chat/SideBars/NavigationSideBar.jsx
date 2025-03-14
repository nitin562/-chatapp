import React, { useEffect, useState } from "react";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { HiOutlineStatusOnline } from "react-icons/hi";
import IconBadge from "../../../Utils/IconBadge";
import { Avatar } from "@chakra-ui/react";
import { apiLinks, completeUrl } from "../../../links";
import { asyncFetch } from "../../../Utils/Helpers/asyncFetch";
import { useGlobal } from "../../../Utils/Context/Global";
import { setUser } from "../../../Redux/slice/user";
import { useDispatch, useSelector } from "react-redux";
export default function NavigationSideBar({menu,setmenu}) {
  const toast = useGlobal().toast;
  const dispatch = useDispatch();
  const user=useSelector(state=>state.user.user)
  console.log(user)
  const getUserProfile = async () => {
    const url = apiLinks.profile;
    const { error, result } = await asyncFetch(
      "GET",
      url,
      {},
      null,
      null,
      true
    );
    if (error || !result.success) {
      toast({
        description: error?.message || result.error,
        status: "error",
        isClosable: true,
      });
    } else {
      if(result.success){
        dispatch(setUser(result.payload))
      }
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  const selectTab=(val)=>{
    return()=>setmenu(val)
  }
  return (
    <div className="flex flex-row md:flex-col bg-slate-800 w-full md:w-fit md:h-full px-4 py-1 md:py-6 justify-between">
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
