import { useState } from "react";
import { createContext } from "react";

export const Context = createContext();

export default function MyContext(props){
    const [ user , setUser ] = useState(null)
    function getUser(userid){
        return setUser(userid)
    }
    return(
        <Context.Provider value={{getUser , user}}>
            {props.children}
        </Context.Provider>
    )
}