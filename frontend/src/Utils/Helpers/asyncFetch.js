
export const fetchHandler=async(method,url,extra_headers={},extra_body=null,csrf=null,isJWT=false,toast=null)=>{
    try {

        const headers={
            ...extra_headers
        }
        if(isJWT){
            headers["Authorization"]=`Bearer ${localStorage.getItem("token")}`
        }
        if(csrf){
            headers["X-CSRFTOKEN"]=csrf
        }
        const options={
            method,
            credentials:"include",
            headers
        }
        if(extra_body){
            options["body"]=extra_body
        }
        
        const response=await fetch(url,options)
        const result=await response.json()
        if(isJWT && result.error && result.error.type=="token"){
            toast({
                status:"error",
                description:result.error.msg,
                isClosable:true,
                duration:3000,
                autoclosable:true,
                position:'bottom-right',
            })
        }
        return {error:null,result}
    } catch (error) {
        console.log(error)
        if(error.cause?.origin=="manual"){
            //means it is generated by user
            console.log(error.message)

        }
        else{
            console.log("System Issue Occured")
        }
        return {error,result:null}
    }
}