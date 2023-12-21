import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminConsole = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [groupName, setGroupName] = useState('');
  


  useEffect(() => {
    axios.get('/users_unac').then((response) => {
      const users = response.data;
      const studentList = users.filter((user) => user.userType === 'Student');
      const mentorList = users.filter((user) => user.userType === 'Guide');
      setStudents(studentList);
      setMentors(mentorList);
    });
  }, []);

  const handleCheckboxChange = (event, type, user) => {
    const selectedId = user._id;

    if (type === 'Student') {
      setSelectedStudents((prevSelected) => {
        if (prevSelected.some((student) => student._id === selectedId)) {
          return prevSelected.filter((student) => student._id !== selectedId);
        } else {
          return [...prevSelected, user];
        }
      });
    } else if (type === 'Mentor') {
      setSelectedMentors((prevSelected) => {
        if (prevSelected.some((mentor) => mentor._id === selectedId)) {
          return prevSelected.filter((mentor) => mentor._id !== selectedId);
        } else {
          return [...prevSelected, user];
        }
      });
    }
  };

  const handleButtonClick = () => {
    const selectedStudentIds = selectedStudents.map(student => student._id);
    const selectedMentorIds = selectedMentors.map(mentor => mentor._id);
  
    // Call the backend endpoint to update students' hasJoinedGroup field
    axios.post('/updateStudentsGroupStatus', {
      studentIds: selectedStudentIds,
      mentorIds: selectedMentorIds,
      groupName,
    })
    .then(response => {
      console.log(response.data); // Log success message
      // Perform other actions if needed
    })
    .catch(error => {
      console.error(error); // Handle errors
      // Show an error message or perform other actions
    });
  
    // Log the selected students and mentors to the console
    console.log('Selected Students:', selectedStudents);
    console.log('Selected Mentors:', selectedMentors);
    // You can perform other actions with the selected items here
  };
  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                value={student._id}
                onChange={(event) => handleCheckboxChange(event, 'Student', student)}
                className="mr-2"
              />
              {student.fullName}
            </label>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold my-4">Mentors</h2>
      <ul>
        {mentors.map((mentor) => (
          <li key={mentor._id} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                value={mentor._id}
                onChange={(event) => handleCheckboxChange(event, 'Mentor', mentor)}
                className="mr-2"
              />
              {mentor.fullName}
            </label>
          </li>
        ))}
      </ul>

      <input type="text" className='bg-blue-200 py-2 mr-1 rounded-sm text-center' placeholder='Enter Group name' value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
      
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Submit
      </button>

      {/* Display selected items on the webpage */}
      {/* <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Selected Students</h3>
        <ul>
          {selectedStudents.map((student) => (
            <li key={student._id}>{student.fullName}</li>
          ))}
        </ul>

        <h3 className="text-xl font-bold mt-4 mb-2">Selected Mentors</h3>
        <ul>
          {selectedMentors.map((mentor) => (
            <li key={mentor._id}>{mentor.fullName}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default AdminConsole;
