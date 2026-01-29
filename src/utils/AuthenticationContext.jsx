import { createContext, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthenticationContext({children}){
    // useEffect(()=>{

    //     getUserId();

    //     getUserId();
    
    // },[])
    
    var userDetails = {userId : "123" , userName : "Ram"};
    
    async function getUserId(){
    
        let response = await fetch("http://localhost:8080/WorkDrive/getUserId");
        let data = await response.json();
        if(data.statusCode == 200){
            userDetails.userId = data.userId;
            userDetails.userName = data.userName;
        }
    
    }
    return (
    <>
        <AuthContext.Provider value={userDetails}>{children}</AuthContext.Provider>
    </>
    );
}