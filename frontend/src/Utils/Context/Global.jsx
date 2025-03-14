import React, { createContext, useContext, useState } from "react";
import { useToast } from '@chakra-ui/react'
import Notification from "../Notification/Notification";
const globalContext=createContext()
export const useGlobal=()=>{
    return useContext(globalContext)
}
const ContextProvider=(props)=>{
    const toast=useToast({
        render:(e)=><Notification title={e.title} closeBtn={e.isClosable} desc={e.description} status={e.status} onclose={e.onClose}/>,
    })
    
    
   

    return(
        <globalContext.Provider value={{toast}}>
            {props.children}
        </globalContext.Provider>
    )
}
export default ContextProvider