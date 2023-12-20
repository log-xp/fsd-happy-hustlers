import { useNavigate } from 'react-router-dom';

function UserTypeForm(){
    const navigate = useNavigate();

    function handleUserTypeSelection(userType) {
        navigate(`/register/${userType}`);
    }

    return (
        <div>
            <button onClick={() => handleUserTypeSelection('student')}>Student</button>
            <button onClick={() => handleUserTypeSelection('guide')}>Guide</button>
        </div>
    );
}

export default UserTypeForm;