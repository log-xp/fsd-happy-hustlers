export default function Avatar({username,userId}){
    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200',
                    'bg-blue-200', 'bg-purple-200', 'bg-teal-200'];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors [colorIndex];
    return(
        <div className={"w-7 h-7 rounded-full flex items-center "+ color}>
            <div className="text-center w-full opacity-60">{username[0]}</div>
        </div>

    )
}