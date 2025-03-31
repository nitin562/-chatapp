export const base="http://127.0.0.1:8000"
export const completeUrl=(url,type="media")=>{
    if(!url){
        return ""
    }
  
    if(type=="media" && !url.startsWith("/media/")){
        url="media/"+url
    }
  

    let resolvedUrl=new URL(url,base).toString()
   
    return resolvedUrl
}
export const apiLinks={
    login:base+"/api/user/login/",
    register:base+"/api/user/register/",
    get_csrf_token:base+"/api/user/csrf_token/",
    profile:base+"/api/user/profile/", //get
    conversations:base+"/api/chat/conversations/",
    message:base+"/api/chat/messages/",
    searchByChat:base+"/api/chat/search"



}
export const CHOICES={
    message_type:{
        "0":"TEXT",
        "1":"AUDIO",
        "2":"VIDEO",
        "3":"IMAGE",
        "4":"DOCUMENT"
    }
}