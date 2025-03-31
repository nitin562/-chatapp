import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all: {},
  selected:null //key
};
//id can be same for two different contacts because they can be from two tables- type: group and type: self
// but id+type is unique
const contactSlice = createSlice({
    name:"contact",
    initialState,
    reducers:{
        setContacts:(state,action)=>{
            const contacts=action.payload
            const structuredContacts={}
            contacts.forEach((contact)=>{
                const key=`${contact.type}${contact.id}`
                structuredContacts[key]=contact
            })
            state.all=structuredContacts
            
        },
        addContactFromTop:(state,action)=>{
            const {contact}=action.payload
            state.all.push(contact)
        },
        removeContact:(state,action)=>{
            const {contact}=action.payload
            state.all=state.all.filter((curr)=>{
                return !((curr.id==contact.id) && (curr.type==contact.type))
            })
        },
        clearAllContacts:(state)=>{
            state.all=[]
        },
        selectContact:(state,action)=>{
            state.selected=action.payload
            
        }

    }
});
export const {setContacts,addContactFromTop,removeContact,clearAllContacts,selectContact} = contactSlice.actions

export default contactSlice.reducer
