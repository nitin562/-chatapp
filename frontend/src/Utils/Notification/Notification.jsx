import { Box, Button, Spinner } from '@chakra-ui/react';
import React from 'react'
import { IoMdCheckmarkCircleOutline as CheckIcon ,IoMdInformationCircleOutline as InfoIcon} from "react-icons/io";
import { MdErrorOutline as ErrorIcon } from "react-icons/md";
import { TiDeleteOutline as CloseIcon } from "react-icons/ti";
import { PiWarningCircle as WarningIcon } from "react-icons/pi";
export default function Notification({title,desc,status,closeBtn=true,onclose}) {
    const statusStyles = {
        loading: { bg: "#00000099", icon: <Spinner color="white" /> }, // Black with 60% opacity
        success: { bg: "#00ff1d2e", icon: <CheckIcon className='text-green-400 text-4xl' /> }, // Green with 60% opacity
        error: { bg: "rgba(255, 0, 0, 0.16)", icon: <ErrorIcon className='text-red-400 text-4xl' /> }, // Red with 60% opacity
        warning: { bg: "rgba(232, 255, 0, 0.16)", icon: <WarningIcon className='bg-yellow-400 text-4xl' /> }, // Orange with 60% opacity
        info: { bg: "rgba(0, 136, 255, 0.13)", icon: <InfoIcon className='bg-blue-400 text-4xl' /> }, // Blue with 60% opacity
      };
  return (
    <Box
    color="white"
    p={3}
    
    bg={statusStyles[status].bg}
    borderRadius="md"
    display="flex"
    alignItems="center"
    
  >
    {statusStyles[status].icon}
    <Box ml={3} className='flex justify-between flex-1 gap-6 '>
      <Box className='flex-1'>
        <strong className='font-[Quicksand] text-lg'>{title}</strong>
        <p className='font-[Quicksand] text-md'>{desc}</p>
      </Box>
      {closeBtn&&<Box className='flex gap-3 items-center mt-4'>
        <CloseIcon className='text-white hover:text-red-500 text-3xl' onClick={onclose}/>
      </Box>}
    </Box>
  </Box>
  )
}
