import { createContext, useEffect } from "react";

export const authContext = createContext();

useEffect(()=>{

    getUserId();

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

export default function AuthenticationContext({children}){
    <>
        <authContext.Provider value={userDetails}>{children}</authContext.Provider>
    </>
}