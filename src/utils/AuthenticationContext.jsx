import { createContext, useEffect } from "react";

export const authContext = createContext();

export default function AuthenticationContext({children}){
    useEffect(()=>{

        getUserId();

        console.log("hii");
    
    },[])
    
    var userDetails = {userId : "" , userName : ""};
    
    async function getUserId(){
    
        let response = await fetch("http://localhost:8080/WorkDrive/getUserId");
        let data = await response.json();
        if(data.statusCode == 200){
            userDetails.userId = data.userId;
            userDetails.userName = data.userName;
        }
    
    }
    <>
        <authContext.Provider value={userDetails}>{children}</authContext.Provider>
    </>
}