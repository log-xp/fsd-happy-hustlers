import React from 'react';
import Avatar from './Avatar'; // Import Avatar component

function GroupChat({ groupId, groupName, onClick, selected }) {
    return (
        <div key={groupId} onClick={() => onClick(groupId)} 
            className={"border-b border-gray-100 flex gap-2 cursor-pointer " + (selected ? 'bg-blue-50' : '')}>
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar username={groupName} userId={groupId} online={false} /> {/* Use Avatar component */}
                <span className="text-gray-800">{groupName}</span>
            </div>
        </div>
    );
}

export default GroupChat;
