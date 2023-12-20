import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterAndLoginForm from './RegisterAndLoginForm';
import UserTypeForm from './UserTypeForm';
import StudentRegistrationForm from './StudentRegistrationForm';
import GuideRegistrationForm from './GuideRegistrationForm';
import { useContext  } from "react";
import { UserContext } from './assets/UserContext';
import Chat from "./Chat";



function Routes1() {
    const {username , id} = useContext(UserContext);
    
    if (username){
        return <Chat /> ;
    }
    
    return(
        <Router>
            <Routes>
                <Route path="/" element={<RegisterAndLoginForm/>} />
                <Route path="/login" element={<RegisterAndLoginForm/>} />
                <Route path="/register" element={<RegisterAndLoginForm/>} />
                <Route path="/register/student" element={<StudentRegistrationForm/>} />
                <Route path="/register/guide" element={<GuideRegistrationForm/>} />
            </Routes>
        </Router>
    );
}

export default Routes1;