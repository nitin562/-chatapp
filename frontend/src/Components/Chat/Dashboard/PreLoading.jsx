import React, { useEffect, useState } from "react";
import { useGlobal } from "../../../Utils/Context/Global";
import { useDispatch } from "react-redux";
import { apiLinks } from "../../../links";

import { setUser } from "../../../Redux/slice/user";
import { setContacts } from "../../../Redux/slice/contact";
import { Progress } from "@chakra-ui/react";
import { IoRefresh } from "react-icons/io5";
import { setMessages } from "../../../Redux/slice/message";
import { useFetch } from "../../../Utils/Helpers/UseFetch";





export default function PreLoading({ setPreloading }) {
  const asyncFetch=useFetch()
  const toast = useGlobal().toast;
  const dispatch = useDispatch();
  const [processing, setprocessing] = useState(70.5);
  const [processNotFulFilled, setprocessNotFulFilled] = useState(false)
  const [retry, setretry] = useState(true)

  const getUserProfile = async (resolve, reject) => {
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
     
      reject(error||result.error)
    } else {
      if (result.success) {
        console.log(result);
        dispatch(setUser(result.payload));
        localStorage.setItem("u_name",result.payload.username)
        
        resolve()
      }
    }
  };
  const GetAllContacts = async (resolve,reject) => {
    const url = apiLinks.conversations;
    const { error, result } = await asyncFetch(
      "GET",
      url,
      {},
      null,
      null,
      true
    );
    console.log(error, result);
    if (error || !result.success) {
      
      reject(error||result.error)
    } else {
      if (result.success) {
        dispatch(setContacts(result.payload));
        resolve()
      }
    }
  };
  const GetMessages = async (resolve,reject) => {
    const url = apiLinks.message;
    const { error, result } = await asyncFetch(
      "GET",
      url,
      {},
      null,
      null,
      true
    );
    console.log(error, result);
    if (error || !result.success) {
      
      reject(error||result.error)
    } else {
      if (result.success) {
        dispatch(setMessages(result.payload));
        console.log(result)
        resolve()
      }
    }
  };
  useEffect(() => {
    if(!retry){
      return
    }
    let count=0;
    let id=setInterval(()=>{
      if(count>75){
        clearInterval(id)
      }
      count+=0.5
      setprocessing(count)
    },10)
    const userPromise=new Promise(getUserProfile)
    const contactPromise=new Promise(GetAllContacts)
    const messagePromise=new Promise(GetMessages)
    Promise.all([userPromise,contactPromise,messagePromise]).then(()=>{
      setprocessing(100)
      count=100
      setTimeout(()=>{
      
        setPreloading(false)
      },1000)
    },(error)=>{
      console.log("error",error)
      toast({
        title:"Connectivity Problem",
        description: typeof error=="string"?error:"Connectivity issue",
        status: "error",
        isClosable: true,
      });
      setprocessNotFulFilled(true)
      setretry(false)
    });
  }, [retry]);

  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col gap-3  items-center justify-center">
      <img
        src="./logo.png"
        alt="logo"
        className="object-contain w-[5rem] md:w-[10rem]"
      />
      <span className="text-gray-300 text-xl font-[Quicksand]">Loop</span>
      <div className="w-full md:w-1/2 p-2 px-5">
        <Progress 
          
          minWidth={"full"}
          value={processing}
          animate={{ width: `${processing}%` }} // Smooth animation
          sx={{ transition: "width 0.5s ease-in-out" }} // Smooth animation
          size={"xs"}
          borderRadius={"3xl"}
          colorScheme="cyan"
         
        />
        {processNotFulFilled&&<div className="w-full mt-2" onClick={()=>setretry(true)}>
        <p className="flex items-center justify-center cursor-pointer w-full group text-gray-300 gap-2 text-[0.9rem]">Try Again? <IoRefresh className="text-xl  group-hover:text-rose-400 "/></p>
        </div>}
      </div>
      
    </div>
  );
}
