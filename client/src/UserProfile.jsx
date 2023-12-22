import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Fetch user data from the backend API endpoint
    axios.get('/profile').then((res) => {
      setUserData(res.data);
    });
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <p>Username: {userData.username}</p>
      </div>
    </div>
  );
}