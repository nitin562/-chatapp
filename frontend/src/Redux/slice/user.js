import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user:{}
}
const user=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },
        deleteUser:(state,action)=>{
            state.user={}
        },
        updateUser:(state,action)=>{
            const {name,value}=action.payload
            if(state.user[name]!=undefined){
                state.user[name]=value
            }
            else{
                state.user.demographic[name]=value
            }
            console.log("updated",name,value,state.user)
        }
    }
})
export const {setUser,deleteUser,updateUser}=user.actions
export default user.reducer