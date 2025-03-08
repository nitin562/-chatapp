import React from 'react'
import { MdDriveFileRenameOutline } from "react-icons/md";
export default function Custom_input({
    isReq=false,
    placeholder,
    type,
    name,
    icon=<MdDriveFileRenameOutline className='text-2xl'/>,
    value,
    setvalue=null, //assuming it is a method that simply update a single plain state, not object
    custom_set_value=null, //when you want to apply custom_set_value for modifying an object
    error=null,
    inputClass="",
    divClass="",
}) {
    const inputChange=(e)=>{
      if(custom_set_value){
        custom_set_value(e.target.value,name)
      }
      else{
        setvalue(e.target.value)

      }
    }
  return (
    <div className={`w-full md:w-1/2 flex flex-col group ${divClass}`}>
        <div className='flex relative flex-1'>
            {icon&&<div className='min-w-[3.5rem]  h-[3rem] flex justify-center items-center bg-gradient-to-r from-rose-600 to-yellow-300 *:text-[#000000a4] group-focus-within:*:text-[#000]'>{icon}</div>}
            <input name={name} className={`flex-1  placeholder:text-gray-400 indent-1.5 text-white text-lg outline-none border-2 border-[#ffd04f]  ${inputClass}`} type={type} value={value} onChange={inputChange} placeholder={placeholder} required={isReq}/>
            {isReq&&<div className='absolute -top-2 -right-2 w-[5px] h-[5px] rounded-full text-xl bg-red-500' title="required Field"></div>}
        </div>
       {error&&<span className='text-red-500 text-sm'>{error}</span>}
    </div>
  )
}
