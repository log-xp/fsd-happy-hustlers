import { useEffect } from "react";
import { useState ,useContext } from "react";
import Avatar from "./Avatar";
import Logo from "./logo";
import { UserContext } from "./assets/UserContext";


export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId,setSelectedUserId] = useState(null);
    const {username,id} = useContext(UserContext)
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message',handleMessage)
    },[]);

    function showOnlinePeople(peopleArray){
        const people = {};
        peopleArray.forEach(({userId,username}) => people[userId] = username);
        console.log(people);
        setOnlinePeople(people);
    }

    function handleMessage(ev){
        const messagedata = JSON.parse(ev.data);
        if('online' in messagedata){
            showOnlinePeople(messagedata.online);
        }
    }

    const onlinePeopleExclOurUser = {...onlinePeople};
    delete onlinePeopleExclOurUser[id];


    return(
        <div className="flex h-screen">
            <div className="bg-white w-1/3 ">
                <Logo/>
                {Object.keys(onlinePeople).map(userId => (
                    <div key={userId} onClick={() => setSelectedUserId(userId)} 
                        className={"border-b border-gray-100  flex gap-2 items cursor-pointer "+(userId === selectedUserId ? 'bg-blue-50' : '')}>
                        {userId === seletedUserId && (
                            <div > className="w-1 bg-blue-500 h-12 rounded-r-md" </div>
                        )}
                        <Avatar username={onlinePeople[userId]} userId={userId}/>
                        <span className="text-gray-800">{onlinePeople[userId]}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">messages with selected person</div>
                <div className="flex gap-2 mx-2">
                    <input type="text"
                            placeholder="Type your message here" 
                            className="bg-white flex-grow border rounded-sm p-2"/>
                    <button className="bg-blue-500 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}