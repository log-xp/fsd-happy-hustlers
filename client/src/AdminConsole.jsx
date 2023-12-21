import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminConsole() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentors, setSelectedMentors] = useState([]);

  useEffect(() => {
    axios.get('/users_unac').then((response) => {
      const users = response.data;
      const studentList = users.filter((user) => user.userType === 'Student');
      const mentorList = users.filter((user) => user.userType === 'Guide');
      setStudents(studentList);
      setMentors(mentorList);
    });
  }, []);

  const handleStudentCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleMentorCheckboxChange = (mentorId) => {
    setSelectedMentors((prevSelected) =>
      prevSelected.includes(mentorId)
        ? prevSelected.filter((id) => id !== mentorId)
        : [...prevSelected, mentorId]
    );
  };

  const handleSubmit = () => {
    // Handle the submission logic with selectedStudents and selectedMentors
    console.log('Selected Students:', selectedStudents);
    console.log('Selected Mentors:', selectedMentors);
    // Add your logic for submission here
  };

  return (
    <div>
      <h1>Admin Console</h1>
      <h2>Students:</h2>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
        {students.map((student) => (
          <li key={student.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentCheckboxChange(student.id)}
              />
              {student.username}
            </label>
          </li>
        ))}
      </ul>

      <h2>Mentors:</h2>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
        {mentors.map((mentor) => (
          <li key={mentor.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedMentors.includes(mentor.id)}
                onChange={() => handleMentorCheckboxChange(mentor.id)}
              />
              {mentor.username}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
