import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './assets/UserContext';
import styled from "styled-components";





const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://img.freepik.com/premium-photo/texture-craft-white-light-blue-paper-background-half-two-colors-macro-structure-vintage-cerulean-cardboard_113767-5918.jpg?size=626&ext=jpg")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 80%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border-radius:10px;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const TextInput = styled.input`
  width: calc(100% - 22px);
  padding: 10px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  width: 40%;
  border: none;
  padding: 10px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-right: 10px;
`;

const LogoutButton = styled.button`
  background-color: #ccc;
  padding: 10px;
  cursor: pointer;
`;
const AdminConsole = () => {
  const [ws,setWs] = useState(null);
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

  const logout = () => {
    axios.post('/logout').then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
  })
  
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
    <Container>
    <Wrapper>
      <Title>Students</Title>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Select</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Score</TableHeader>
            <TableHeader>Fav Subject</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>
                <input
                  type="checkbox"
                  value={student._id}
                  onChange={(event) => handleCheckboxChange(event, 'Student', student)}
                />
              </TableCell>
              <TableCell>{student.fullName}</TableCell>
              <TableCell>{student.score}</TableCell>
              <TableCell>{student.favSubject}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Title>Mentors</Title>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Select</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Score</TableHeader>
            <TableHeader>Expertise</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {mentors.map((mentor) => (
            <TableRow key={mentor._id}>
              <TableCell>
                <input
                  type="checkbox"
                  value={mentor._id}
                  onChange={(event) => handleCheckboxChange(event, 'Mentor', mentor)}
                />
              </TableCell>
              <TableCell>{mentor.fullName}</TableCell>
              <TableCell>{mentor.collegeGPA}</TableCell>
              <TableCell>{mentor.expertise}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <TextInput
        type="text"
        placeholder="Enter Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      
      <SubmitButton onClick={handleButtonClick}>Submit</SubmitButton>

      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </Wrapper>
  </Container>
  );
};

export default AdminConsole;
