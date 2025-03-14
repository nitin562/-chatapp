import React from "react";
import Custom_input from "../../Utils/Custom_input";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoMail, IoKeySharp } from "react-icons/io5";
import { GrFormNextLink } from "react-icons/gr";
import { apiLinks } from "../../links";
import { getFormErrors } from "../../Utils/Validations/GetErrors";
import { asyncFetch } from "../../Utils/Helpers/asyncFetch";
import { get_csrf_token } from "../../Utils/Helpers/getCSRF";
import { useGlobal } from "../../Utils/Context/Global";
import Notification from "../../Utils/Notification/Notification";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
  const [formValue, setformValue] = useState({
    user_or_email: "",
    password: "",
    filter_by: "email",
  });
  const nav=useNavigate()
  const toast=useGlobal().toast
  const [FormErrors, setFormErrors] = useState({});
  const changeFilter_by = () => {
    setformValue((prev) => {
      const obj = { ...prev };
      if (obj.filter_by == "email") {
        obj.filter_by = "username";
      } else {
        obj.filter_by = "email";
      }
      return obj;
    });
  };
  const custom_set_value = (value, name) => {
    setformValue((prev) => {
      const obj = { ...prev };
      obj[name] = value;
      return obj;
    });
  };
  const HandleLogin = async (resolve,reject) => {
   
    setFormErrors({});
    const values = { ...formValue };
    const errors = {};
    if (values.password == "" || values.password.length < 6) {
      errors["password"] = "Password must be atleast 6 Characters.";
    }
    if (values.filter_by == "email" && values.user_or_email == "") {
      errors["user_or_email"] = "Email is Required.";
    }
    if (values.filter_by == "username" && values.user_or_email.length < 3) {
      errors["user_or_email"] = "Username must be atleast 3 Characters.";
    }
    if (Object.keys(errors).length != 0) {
      setFormErrors(errors);
      reject(1);
      return;
    }
    const {error:csrfError,result:csrftoken}=await get_csrf_token()
    if(csrfError){
      console.log(csrfError)
      reject(1)
      return;
    }
    const header={
        "Content-Type": "application/json",
    }
    const {error,result} = await asyncFetch(
      "POST", //method
      apiLinks.login, //url
      header,
      JSON.stringify(values), //body
      csrftoken.payload
    );
    if(error){
      console.log(error)
      reject(1)
      return;
    }
    if (result && result.success == false) {
      const backendErrors = getFormErrors(result, [
        "user_or_email",
        "password",
      ]);
      setFormErrors(backendErrors);
      reject(1)
      return;
    }
    localStorage.setItem("token",result.payload.token)
    resolve(1)
    
  };
  const handleSubmit=(e)=>{
    e.preventDefault();
    const toastPromise=new Promise((resolve,reject)=>{
      HandleLogin(resolve,reject)
    })
    toast.promise(toastPromise,{
      success:{
        title:"Login Completed",
        description:"Redirecting to Chats...",
        duration:3000,
        autoclosable:true,
        position:'bottom-right',
        onCloseComplete:()=>nav("/chat"),
       
        isClosable:true,
        
      },
      error:{
        title:"Login Failed",
        description:"Please Try Again",
        position:'bottom-right',
        autoclosable:true,
      
        duration:3000,
        isClosable:true,
      },
      loading:{
        title:"Processing",
        description:"Please wait for a while",
        position:'bottom-right',
       
      },

    })
  }
  return (
    <div className='relative w-screen h-screen bg-before before:bg-[url("./register.jpg")] z-10 before:opacity-35 bg-[#000000] flex justify-center items-center'>
      <form
        action="#"
        onSubmit={handleSubmit}
        className="w-full h-full  md:w-[60%] gap-6 overflow-x-hidden flex flex-col  items-center justify-center"
      >
        {/* part - Text Field */}

        <img
          src="./logo.png"
          alt="Logo"
          className="w-[8rem] object-contain my-4 mb-6"
        />

        <Custom_input
          isReq={true}
          icon={
            formValue.filter_by == "email" ? (
              <IoMail className="text-2xl" />
            ) : (
              <FaUser className="text-2xl" />
            )
          }
          type={formValue.filter_by == "email" ? "email" : "text"}
          name="user_or_email"
          value={formValue.user_or_email}
          placeholder={
            formValue.filter_by == "email" ? "Enter Email ID" : "Enter Username"
          }
          custom_set_value={custom_set_value}
          error={FormErrors.user_or_email}
        />

        <Custom_input
          isReq={true}
          icon={<IoKeySharp className="text-2xl" />}
          type="password"
          name="password"
          value={formValue.password}
          placeholder="Enter Password"
          custom_set_value={custom_set_value}
          error={FormErrors.password}
        />

        <div className="flex flex-col w-full md:w-1/2 gap-4 items-end">
          <div className="flex justify-between flex-wrap w-full gap-2">
            <span
              className="text-orange-300 hover:text-orange-400 cursor-pointer"
              onClick={changeFilter_by}
            >
              Login With {formValue.filter_by == "email" ? "Username" : "Email"}
            </span>
            <Link to="/register" className="text-blue-300 group">
              Don't have account?{" "}
              <span className="group-hover:text-blue-400">Register</span>
            </Link>
          </div>
          <button
            type="submit"
            className="group bg-blue-500 hover:bg-blue-500 cursor-pointer md:text-xl flex justify-center items-center p-2 w-[8rem] gap-3 text-white"
          >
            <span>Login</span>
            <GrFormNextLink className="rounded-full border-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
