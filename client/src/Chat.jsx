import { useEffect } from "react";
import { useState ,useContext , useRef } from "react";
import Avatar from "./Avatar";
import Logo from "./logo";
import { UserContext } from "./assets/UserContext";
import uniqBy from "lodash/uniqBy";
import axios from "axios"


export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId,setSelectedUserId] = useState(null);
    const [newMessageText,setNewMessageText] = useState('');
    const [messages,setMessages] = useState([]);
    const {username,id} = useContext(UserContext)
    const divUnderMessages = useRef();
    useEffect(() => {
        connectToWs();
    },[]);

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message',handleMessage);
        ws.addEventListener('close',() => connectToWs());
    }

    function showOnlinePeople(peopleArray){
        const people = {};
        peopleArray.forEach(({userId,username}) => people[userId] = username);
        console.log(people);
        setOnlinePeople(people);
    }

    function handleMessage(ev){
        const messageData = JSON.parse(ev.data);
        console.log({ev,messageData});
        if('online' in messageData){
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            setMessages(prev => ([...prev,{...messageData}]));
        }
    }

    function sendMessage(ev) {
        ev.preventDefault();
        ws.send(JSON.stringify({
            recipient : selectedUserId ,
            text : newMessageText ,
        }));

        setNewMessageText('');
        setMessages( prev => ([...prev,{
            text: newMessageText,
            sender:id,
            recipient:selectedUserId,
            _id:Date.now(),
        }]));

    } 

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div){
            div.scrollIntoView({behaviour:'smooth',block:'end'});
        }
    })

    useEffect(() => {
        if (selectedUserId){
            axios.get('/messages/'+selectedUserId).then(res => {
                setMessages(res.data);
            })
        }
    },[selectedUserId])

    const onlinePeopleExclOurUser = {...onlinePeople};
    delete onlinePeopleExclOurUser[id];

    const messagesWithoutDupes = uniqBy(messages,'_id');

    return(
        <div className="flex h-screen">
            <div className="bg-white w-1/3 ">
                <Logo/>
                {Object.keys(onlinePeopleExclOurUser).map(userId => (
                    <div key={userId} onClick={() => setSelectedUserId(userId)} 
                        className={"border-b border-gray-100 flex gap-2 cursor-pointer "+(userId === selectedUserId ? 'bg-blue-50' : '')}>
                        {userId === selectedUserId && (
                            <div className="w-1 bg-blue-500 h-12 rounded-r-md"> </div>
                        )}
                        <div className="flex gap-2 py-2 pl-4 items-center">
                            <Avatar username={onlinePeople[userId]} userId={userId}/>
                            <span className="text-gray-800">{onlinePeople[userId]}</span>
                        </div>
                        
                        
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full flex-grow items-center justify-center">
                            <div className="text-gray-300"> &larr; no selected person</div>
                        </div>
                    )}
                    {!!selectedUserId &&(
                        <div className="relative h-full ">
                        <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                            {messagesWithoutDupes.map(message =>(
                            <div keys={message._id} className={(message.sender === id ? 'text-right':'text-left')}>
                                <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-grey-500')}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                            <div className="h-12" ref={divUnderMessages}> </div>
                        </div>   
                        </div>
                        
                    )}
                </div>
                {!!selectedUserId && (
                    <form className="flex gap-2 " onSubmit={sendMessage}>
                    <input type="text"
                            value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)}
                            placeholder="Type your message here" 
                            className="bg-white flex-grow border rounded-sm p-2"/>
                    <button type='submit' className="bg-blue-500 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
                ) }

            </div>
        </div>
    )
}