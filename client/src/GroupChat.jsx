import React from 'react';
import Avatar from "./Avatar";

export default function GroupChat({ groups, onClick, selectedGroupId }) {
    return (
        <div>
            {groups.map((group) => (
                <div key={group.id} onClick={() => onClick(group.id)} 
                    className={"border-b border-gray-100 flex gap-2 cursor-pointer " + (group.selected ? 'bg-blue-50' : '')}>
                    {group.selected && (
                        <div className="w-1 bg-blue-500 h-12 rounded-r-md"> </div>
                    )}
                    <div className="flex gap-2 py-2 pl-4 items-center">
                        <Avatar online={group.online} groupName={group.groupName} groupId={group.groupId} />
                        <span className="text-gray-800">{group.groupName}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
