import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./assets/UserContext";

export default function RegisterAndLoginForm(){
    const [username , setUsername ] = useState('');
    const [password,setPassword] = useState('');
    const [isLoginOrRegister, setLoginOrRegister] = useState('login');
    const {setUsername:setLoggedInUsername,setId} = useContext(UserContext);
    const [fullName, setFullName] = useState('');
    const [userType, setUserType] = useState('');

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? '/register' : '/login';
        const userData = isLoginOrRegister === 'register' ? { username, password, fullName, userType } : { username, password };

        try {
            const { data } = await axios.post(url, userData);
            setLoggedInUsername(username);
            setId(data.id);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // Notify the user that the username already exists
                alert(err.response.data.message);
            } else {
                // Handle other errors
                console.error(err);
            }
        }
    }    
return(
    <div className="bg-blue-50 h-screen flex items-center ">
        <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
            <input value={username}
                onChange={ev => setUsername(ev.target.value)}
                type="text" placeholder="username" 
                className="block w-full rounded-sm p-2 mb-2  border"/>
            
            <input value={password}
                onChange={ev => setPassword(ev.target.value)}
                type="password" 
                placeholder="password" 
                className="block w-full rounded-sm p-2 mb-2  border"/>
            
            {isLoginOrRegister === 'register' && (
                <div>
                    <input type="text" name="fullName" placeholder="Full Name" onChange={ev => setFullName(ev.target.value)} className="block w-full rounded-sm p-2 mb-2  border"/>
                    <select name="userType" onChange={ev => setUserType(ev.target.value)} className="block w-full rounded-sm p-2 mb-2  border">
                    <option value="">Select User Type</option>
                    <option value="student">Student</option>
                    <option value="guide">Guide</option>
                    </select>
                </div>
                )}

            <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
            </button>
            <div className="text-center mt-2">
                {isLoginOrRegister === 'register' && (
                    <div>
                        Already a member? 
                        <button onClick={() => setLoginOrRegister('login')}>
                            Login here 
                        </button>
                    </div>
                )}
                {isLoginOrRegister === 'login' && (
                    <div>
                        Not a member yet? 
                        <button onClick={() => setLoginOrRegister('register')}>
                            Register here 
                        </button>
                    </div>
                )}
                
            </div>           
        </form>
    </div>
    );
}
