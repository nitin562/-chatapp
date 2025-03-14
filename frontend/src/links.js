export const base="http://127.0.0.1:8000"
export const completeUrl=(url)=>{
    if(!url){
        return ""
    }
   
    let resolvedUrl=new URL(url,base).toString()
   
    return resolvedUrl
}
export const apiLinks={
    login:base+"/api/user/login/",
    register:base+"/api/user/register/",
    get_csrf_token:base+"/api/user/csrf_token/",
    profile:base+"/api/user/profile/", //get


}