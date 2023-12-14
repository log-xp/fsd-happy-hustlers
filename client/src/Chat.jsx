import { useEffect } from "react"
import { useState } from "react"
import Avatar from "./Avatar";

export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
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
    return(
        <div className="flex h-screen">
            <div className="bg-white w-1/3 pl-4 pt-4">
                <div className="text-blue-500 font-bold flex gap-1">
                    
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="18pt" height="18pt" viewBox="0 0 128.000000 128.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M260 869 c-69 -122 -125 -227 -125 -234 0 -7 56 -112 125 -234 l125
-221 260 0 260 1 125 220 c69 122 125 227 125 234 0 7 -56 112 -125 234 l-125
221 -260 0 -260 -1 -125 -220z m580 197 c0 -6 -371 -129 -373 -125 -9 16 -57
120 -57 124 0 3 97 5 215 5 118 0 215 -2 215 -4z m53 -38 c17 -67 68 -380 64
-385 -6 -5 -457 268 -457 277 0 4 358 125 381 129 4 1 9 -9 12 -21z m-474 -37
c11 -27 21 -53 21 -58 0 -9 -210 -218 -244 -244 -14 -10 -11 1 13 41 17 30 64
112 103 183 40 70 75 127 79 127 3 0 16 -22 28 -49z m694 -341 c-9 -9 -114
-32 -119 -27 -4 4 -64 336 -64 356 0 9 43 -60 96 -153 52 -93 92 -172 87 -176z
m-399 107 c126 -78 228 -146 227 -152 -1 -9 -146 -94 -408 -242 l-63 -35 0
286 c0 157 3 286 8 285 4 0 110 -64 236 -142z m-264 -141 l0 -275 -140 142
-140 142 135 133 c75 72 138 132 141 132 2 0 4 -123 4 -274z m670 -1 c0 -8
-203 -365 -206 -362 -1 1 15 76 37 167 21 91 39 168 39 171 0 12 130 35 130
24z m-199 -218 c-21 -93 -41 -170 -44 -173 -2 -3 -89 16 -193 42 -127 32 -183
50 -173 56 115 70 445 253 447 248 1 -3 -15 -81 -37 -173z m-596 37 l118 -126
-23 -44 c-14 -24 -28 -40 -31 -36 -15 15 -192 332 -186 332 2 0 57 -57 122
-126z m328 -185 c89 -22 164 -42 166 -45 2 -2 -86 -4 -197 -4 -120 0 -202 4
-202 9 0 20 43 81 56 81 8 0 88 -18 177 -41z"/>
</g>
</svg>
                
                HappyHustlers
                </div>
                
                {Object.keys(onlinePeople).map(userId => (
                    <div className="border-b border-gray-100 py-2 flex gap-2 items">
                        <Avatar username={onlinePeople[userId]} userId={userId}/>
                        <span>{onlinePeople[userId]}</span>
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