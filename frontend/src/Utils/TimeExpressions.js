const DAYS=["Sunday","Mon","Tues","Wed","Thurs","Fri","Sat"]
export const convertRelativeTimes=(time)=>{
    const t=new Date(time)
    const curr=new Date()
    if(curr.toLocaleDateString()==t.toLocaleDateString()){
        return t.toLocaleTimeString()
    }
    const dayDiff=curr.getUTCDate()-t.getUTCDate()
    if(dayDiff==1){
        return "Yesterday"
    }
    if(dayDiff<=6){
        return DAYS[t.getDay()]
    }
    return t.toLocaleDateString()
}