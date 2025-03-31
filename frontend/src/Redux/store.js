import { configureStore } from '@reduxjs/toolkit'; 
import userReducers from "./slice/user"
import contactReducers from "./slice/contact"
import messageReducers from "./slice/message"


export const store=configureStore({
    reducer:{
        user:userReducers,
        contact:contactReducers,
        messages:messageReducers
    }

})