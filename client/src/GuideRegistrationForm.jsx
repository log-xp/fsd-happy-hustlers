import { useState } from 'react';
import axios from 'axios';

function GuideRegistrationForm() {
    const [fullName, setFullName] = useState('');
    const [expertise, setExpertise] = useState('');
    const [collegeGPA, setCollegeGPA] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/register', {
                username: 'username', // replace with actual username
                password: 'password', // replace with actual password
                userType: 'guide',
                fullName,
                expertise,
                collegeGPA
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
                Area of Expertise:
                <input type="text" value={expertise} onChange={(e) => setExpertise(e.target.value)} />
            </label>
            <label>
                College GPA:
                <input type="number" step="0.01" value={collegeGPA} onChange={(e) => setCollegeGPA(e.target.value)} />
            </label>
            <button type="submit">Register</button>
        </form>
    );
}

export default GuideRegistrationForm;