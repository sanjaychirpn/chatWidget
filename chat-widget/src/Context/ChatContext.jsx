import { useState } from "react";
import { createContext } from "react";

export const Chat = createContext();

export default function ChatContext(props){
    const [ adminId , setAdminId ] = useState(null)
    const [ currentUserId , setCurrentUserId ] = useState(null)
    const [ inboxId , setinboxId ] = useState(null)
    const [ userName , setUserName ] = useState(null)
    
    function getUser( currentUserId, adminId , displayName){
        setAdminId(adminId)
        setCurrentUserId(currentUserId)
        setinboxId(adminId + currentUserId)
        setUserName(displayName)
    }
    return(
        <Chat.Provider value={{getUser , userName , adminId , currentUserId , inboxId}}>
            {props.children}
        </Chat.Provider>
    )
}