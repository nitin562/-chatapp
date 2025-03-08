export const getFormErrors=(data,fields)=>{ //use when form based errors will come
    const errors={}
    fields.forEach((fieldname)=>{
        if(data.error[fieldname]){
            errors[fieldname]=data.error[fieldname][0].message
        }
    })
    return errors
}