import { configureStore } from '@reduxjs/toolkit'; 
import userReducers from "./slice/user"
export const store=configureStore({
    reducer:{
        user:userReducers
    }

})