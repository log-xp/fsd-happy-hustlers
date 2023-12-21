import { createContext, useState , useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function  UserContextProvider({children}){
    const [username,setUsername] = useState(null);
    const [id ,setId] = useState(null);
    const [isAdmin,setIsAdmin] = useState(false);
    useEffect(() => {
        axios.get('/profile').then(response => {
            setId(response.data.userId);
            setUsername(response.data.username);
            setIsAdmin(response.data.isAdmin);
        });
},[]);

    return(
        <UserContext.Provider value={{username,setUsername,id,setId,isAdmin,setIsAdmin}}>
            {children}
        </UserContext.Provider>
    );

}