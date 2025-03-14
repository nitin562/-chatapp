import React from 'react'
import Custom_input from '../../Utils/Custom_input'
import { useState } from 'react'
import { FaUser } from "react-icons/fa";
import { IoMail,IoKeySharp  } from "react-icons/io5";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import Drawer from '../../Utils/Drawer';
import { apiLinks } from '../../links';
import { asyncFetch } from '../../Utils/Helpers/asyncFetch';
import { get_csrf_token } from '../../Utils/Helpers/getCSRF';
import { useGlobal } from '../../Utils/Context/Global';
import { getFormErrors } from '../../Utils/Validations/GetErrors';
import { Link, useNavigate } from 'react-router-dom';
export default function Register() {
    const [formValue, setformValue] = useState({
        username:"",
        email:"",
        password:"",
        first_name:"",
        last_name:"",
        description:"",
        profile_pic:null
    })
    const nav=useNavigate()
     const toast=useGlobal().toast
    const [FormErrors, setFormErrors] = useState({})
    const [profile_pic_dataURL, setProfile_pic_dataURL] = useState("./user.png")
    const [page, setpage] = useState(1)
    const custom_set_value=(value,name)=>{
        setformValue(prev=>{
            const obj={...prev}
            obj[name]=value;
            console.log(obj)
            return obj;
        })
    }
    const handleRegister=async(e,resolve,reject)=>{
        e.preventDefault()
        setFormErrors({})
        setpage(-1) //disable the prev and submit
        let errorPage=null
        const requiredFields=[{name:"username",min:3},{name:"first_name",min:3},{name:"email"},{name:"password",min:6}]
        const errors={}
        const Values={...formValue}
        requiredFields.forEach(({name,min})=>{
            const value=Values[name]
            if(!value){
                errors[name]=`${name} is required.`
                errorPage=1
            }
            else{
                //customs
                if(min && value.length<min){
                    errors[name]=`${name} must be of length ${min} atleast.`
                    errorPage=1
                }
            }
        })
        if(Values.description != "" && Values.description.length>200){
            console.log(true)
            errors["description"]=`Status must be less than 200.`
            errorPage=errorPage?errorPage:2
        }

        if(Object.keys(errors).length!=0){ 
            setFormErrors(errors)
            setpage(errorPage)
            console.log(errorPage)
            reject("Form Values Contraints breaked")
            return;
        }
        const {error:csrfError,result:csrfToken}=await get_csrf_token()
        if(csrfError){
            console.log(csrfError)
            reject(1)
            return
        }
        const formdt=new FormData()
        console.log(Values)
        for(const key in Values){
  
          formdt.append(key,Values[key])
        }
        const {error,result}=await asyncFetch("POST",apiLinks.register,{},formdt,csrfToken.payload)
        if(error){
            console.log(error)
            reject(1)
            return
        }

        if(result.success==false){
            const backendErrors=getFormErrors(result,["username","first_name","last_name","password","email","description","profile_pic"])
            setFormErrors(backendErrors)
            if(backendErrors.username || backendErrors.email||backendErrors.last_name||backendErrors.first_name||backendErrors.password){
                setpage(1)
            }
            else{
                setpage(2)
            }
            reject("Form Values Contraints breaked")
            return;
        }
        localStorage.setItem("token",result.payload.token)
        setpage(2)
        resolve(1)
        
    }
    const handleNext=(e)=>{
        if(page==2){
            const toastPromise=new Promise((resolve,reject)=>{
                handleRegister(e,resolve,reject)
              })
              toast.promise(toastPromise,{
                success:{
                  title:"Login Completed",
                  description:"Redirecting to Chats...",
                  duration:3000,
                  autoclosable:true,
                  variant:"subtle",
                  position:'bottom-right',
                  onCloseComplete:()=>nav("/chat"),
                  isClosable:true,
                },
                error:(err)=>({
                  title:"Login Failed",
                  description:err||"Please Try Again",
                  variant:"subtle",
                  position:'bottom-right',
                  autoclosable:true,
          
                  duration:3000,
                  isClosable:true,
                }),
                loading:{
                  title:"Processing",
                  description:"Please wait for a while",
                  variant:"subtle",
                  position:'bottom-right',
          
                },
          
              })
        }
        else{
            setpage(prev=>{
                return prev+1
            })
        }
        
    }
    const handlePrev=()=>{
        if(page!=1){
            setpage(prev=>{
                return prev-1
            })
        }
        
    }
    const handleImageUpload=(e)=>{
        if(e.target.files.length<=0){
            custom_set_value(null,"profile_pic")
            setProfile_pic_dataURL("./user.png")
            return
        }
        console.log(e.target.files[0])
        custom_set_value(e.target.files[0],"profile_pic")
        const fileReader=new FileReader()
        fileReader.onload=(file)=>{
            setProfile_pic_dataURL(file.target.result)
        }
        
        fileReader.readAsDataURL(e.target.files[0])
    }
  return (
    <div className='relative w-screen h-screen bg-before before:bg-[url("./register.jpg")] z-10 before:opacity-35 bg-[#000000] flex justify-center items-center'>
        <form onSubmit={(e)=>e.preventDefault()} action="#" className='w-full h-full  md:w-[60%] overflow-x-hidden flex flex-col  items-center justify-center' >
            {/* part - Text Field */}
            <div className='w-full flex-1 flex flex-col transition-all duration-500 items-center justify-center gap-4 p-2' style={{display:`${page==1?"flex":"none"}`}}>
                <img src="./logo.png" alt="Logo" className='w-[8rem] object-contain my-4 mb-6'/>
                <Custom_input isReq={true} type="text" name="first_name" value={formValue.first_name} placeholder="Enter First Name" custom_set_value={custom_set_value} error={FormErrors.first_name} />

                <Custom_input type="text" name="last_name" value={formValue.last_name} placeholder="Enter Last Name" error={FormErrors.last_name} custom_set_value={custom_set_value}  />

                <Custom_input isReq={true} icon={<FaUser className='text-2xl'/>} type="text" name="username" value={formValue.username} placeholder="Enter User Name" error={FormErrors.username} custom_set_value={custom_set_value}  />

                <Custom_input isReq={true} icon={<IoMail className='text-2xl'/>} type="email" name="email" value={formValue.email} placeholder="Enter Email ID" custom_set_value={custom_set_value} error={FormErrors.email} />

                <Custom_input isReq={true} icon={<IoKeySharp className='text-2xl'/>} type="password" name="password" value={formValue.password} placeholder="Enter Password" custom_set_value={custom_set_value} error={FormErrors.password} />
                <div className="flex justify-end w-full md:w-1/2">
                  <Link to="/" className='text-blue-300 group'>Already have account? <span className='group-hover:text-blue-400'>Login</span></Link>
                </div>

            </div>
            {/* part - Profile Pic and Description */}
            <div className='w-full md:w-1/2 flex-1 flex flex-col transition-all duration-500 items-center justify-center p-2' style={{display:`${page==2||page==-1?"flex":"none"}`}}>
                <div className='w-[8rem] h-[8rem] rounded-full bg-cover bg-center bg-no-repeat' style={{backgroundImage:`url('${profile_pic_dataURL}')`}}></div>
                {/* Description */}
                <label className="block w-full mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="status">Your Status</label>
                <textarea id='status' name="description" className='p-2 text-white border-[1px] border-gray-300 focus-within:border-white outline-0 rounded-md w-full h-[15rem]' placeholder='Write about yourself upto 200 Characters...' onChange={(e)=>custom_set_value(e.target.value,"description")} value={formValue.description}></textarea>
                <p className='w-full text-white flex items-center gap-4'><span className='text-blue-400'>Characters: </span>{formValue.description.length}</p>
                {formValue.description.length>200 && <p className="mt-1 w-full text-sm text-red-500" >Status must be less than 200</p>}
                {/* Profile_pic */}
                <span className="mt-1 text-red-500" id="file_input_help"></span>
                <div className='flex flex-col w-full my-2'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>

                    <input accept='image/*' className=" w-full text-sm p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" onChange={handleImageUpload}/>
                    
                </div>
            </div>
            <div className='w-full md:w-1/2 p-2 md:p-1 flex justify-between items-center my-3'>
                <button disabled={page==-1} onClick={handlePrev} style={{visibility:`${page==1?"hidden":"visible"}`}} className='bg-rose-500/40 hover:bg-rose-500 cursor-pointer md:text-xl w-[8rem] flex justify-center items-center p-2 gap-3 text-white'>
                        <span>BACK</span><GrFormPreviousLink/>
                </button>
                <Drawer n={2} pos={page} widths="10"/>
                <button disabled={page==-1} onClick={handleNext} className='bg-blue-500/40 hover:bg-blue-500 cursor-pointer md:text-xl flex justify-center items-center p-2 w-[8rem] gap-3 text-white'>
                    <span>{(page==2||page==-1)?"SUBMIT":"NEXT"}</span><GrFormNextLink/>
                </button>
            </div>   
        </form>
    </div>
  )
}
