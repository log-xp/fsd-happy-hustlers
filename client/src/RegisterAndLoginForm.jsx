import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./assets/UserContext";

export default function RegisterAndLoginForm(){
    const [username , setUsername ] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setLoginOrRegister] = useState('login');
    const {setUsername: setLoggedInUsername, setId} = useContext(UserContext);
    const [fullName, setFullName] = useState('');
    const [userType, setUserType] = useState('');
    const [score, setScore] = useState(''); // for students
    const [favSubject, setFavSubject] = useState(''); // for students
    const [collegeGPA, setCollegeGPA] = useState(''); // for guides
    const [expertise, setExpertise] = useState(''); // for guides

    async function handleSubmit(ev){
        ev.preventDefault();
        const userData = {
            username,
            password,
            fullName,
            userType
        };
        if (userType === 'Student') {
            userData.score = score;
            userData.favSubject = favSubject;
        } else if (userType === 'Guide') {
            userData.collegeGPA = collegeGPA;
            userData.expertise = expertise;
        }

        const url = isLoginOrRegister === 'register' ? '/register' : '/login';
        try {
            const {data} = await axios.post(url, userData);
            setLoggedInUsername(username);
            setId(data.id);
            if (isLoginOrRegister === 'register') {
                history.push(`/register/${userType}`);
            } else {
                if (data.isAdmin) {
                    history.push('/AdminConsole');
                } else {
                    history.push('/chat');
                }
            }
        } catch (err) {
            // Handle errors
        }
    }

    return (
        <div className="bg-blue-50 h-screen flex items-center ">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                {/* Common Fields */}
                <input value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    type="text" placeholder="username" 
                    className="block w-full rounded-sm p-2 mb-2  border"/>
                
                <input value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    type="password" 
                    placeholder="password" 
                    className="block w-full rounded-sm p-2 mb-2  border"/>

                {/* Additional Fields for Registration */}
                {isLoginOrRegister === 'register' && (
                    <>
                        <div>
                            <input value={fullName}
                                onChange={ev => setFullName(ev.target.value)}
                                type="text" placeholder="Full Name" 
                                className="block w-full rounded-sm p-2 mb-2  border" required />

                            <select value={userType}
                                onChange={ev => setUserType(ev.target.value)}
                                className="block w-full rounded-sm p-2 mb-2  border" required>
                                <option value="">Select User Type</option>
                                <option value="Student">Student</option>
                                <option value="Guide">Guide</option>
                            </select>

                            {userType === 'Student' && (
                                <>
                                <div className="text-center mt-2">
                                    <button className="bg-blue-200 rounded-sm p-2 mb-2 border w-70">
                                        <a className="no-underline" href="https://forms.office.com/Pages/ResponsePage.aspx?id=o835AF4H5USqC6ujrdZTnxL-Bo7ImyBIhiqY84ESJ-NUQk85VEo0RlVVRExES0xMN00wTTQwQUQ5Ni4u">
                                            Take Assessment
                                        </a>
                                    </button>
                                </div>
                                    {/* <Button className="block bg-blue-200 rounded-sm p-2 mb-2 border"><a className="no-underline" href="https://forms.office.com/Pages/ResponsePage.aspx?id=o835AF4H5USqC6ujrdZTnxL-Bo7ImyBIhiqY84ESJ-NUQk85VEo0RlVVRExES0xMN00wTTQwQUQ5Ni4u">Take Assessment</a></Button> */}
                                    <input value={score}
                                        onChange={ev => setScore(ev.target.value)}
                                        type="text" placeholder="Score"
                                        className="block w-full rounded-sm p-2 mb-2  border" required />

                                    <input value={favSubject}
                                        onChange={ev => setFavSubject(ev.target.value)}
                                        type="text" placeholder="Favorite Subject"
                                        className="block w-full rounded-sm p-2 mb-2  border" required />
                                </>
                            )}

                            {userType === 'Guide' && (
                                <>
                                    <input value={collegeGPA}
                                        onChange={ev => setCollegeGPA(ev.target.value)}
                                        type="text" placeholder="College GPA"
                                        className="block w-full rounded-sm p-2 mb-2  border" required />

                                    <input value={expertise}
                                        onChange={ev => setExpertise(ev.target.value)}
                                        type="text" placeholder="Expertise"
                                        className="block w-full rounded-sm p-2 mb-2  border" required />
                                </>
                            )}
                        </div>
                    </>
                )}
                

                {/* Submit Button and Toggle Link */}
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === 'register' ? (
                        <div>
                            Already a member? 
                            <button onClick={() => setLoginOrRegister('login')}>
                                Login here 
                            </button>
                        </div>
                    ) : (
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
