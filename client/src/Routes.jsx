import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { UserContext } from "./assets/UserContext";
import Chat from "./Chat";
import AdminConsole from "./AdminConsole";

export default function 
Routes() {
    const {username , id , isAdmin} = useContext(UserContext);
    console.log({username , id , isAdmin});

    // add admin login
    if (username && isAdmin === true) {
        //display the word  admin console
        return <AdminConsole />;
    }
    
    if (username){
        return <Chat /> ;
    }
    
    return(
        <RegisterAndLoginForm/>
    );
}