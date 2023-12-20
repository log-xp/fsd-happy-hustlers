import { useState } from 'react';
import axios from 'axios';

function StudentRegistrationForm() {
    const [fullName, setFullName] = useState('');
    const [favSubject, setFavSubject] = useState('');
    const [examScore, setExamScore] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/register', {
                username: 'username', // replace with actual username
                password: 'password', // replace with actual password
                userType: 'student',
                fullName,
                favSubject,
                examScore
            });

            // handle successful registration
        } catch (error) {
            // handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Full Name:
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </label>
            <label>
                Favorite Subject:
                <input type="text" value={favSubject} onChange={(e) => setFavSubject(e.target.value)} />
            </label>
            <label>
                Exam Score:
                <input type="number" value={examScore} onChange={(e) => setExamScore(e.target.value)} />
            </label>
            <button type="submit">Register</button>
        </form>
    );
}

export default StudentRegistrationForm;