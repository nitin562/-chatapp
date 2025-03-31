import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: {},
};

const messageSlice = createSlice({
    name:"messages",
    initialState,
    reducers:{
        setMessages:(state,action)=>{
            state.messages=action.payload
        },
        addMessage:(state,action)=>{
            const {msg}=action.payload
            const key=msg.chat_type+"_"+msg.chat_id
            if(state.messages[key]){
                state.messages[key].push(msg)
            }
            else{
                state.messages[key]=[msg]
            }
        },
        removeMessage:(state,action)=>{
            const {id,key}=action.payload;
            state.messages[key]=state.messages[key].filter((msg)=>{
                return msg.id != id;
            })
        },
       

    }
});
export const {setMessages,addMessage,removeMessage} = messageSlice.actions

export default messageSlice.reducer
