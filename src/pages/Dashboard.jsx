import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';

const Dashboard = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profiles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
          },
        });
        setUserProfiles(response.data); 
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      }
    };

    fetchUserProfiles();
  }, []);

  return (
    <div className="dashboard-container p-8">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="profile-cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProfiles.length === 0 ? (
          <p>No profiles available.</p>
        ) : (
          userProfiles.map((user) => (
            <ProfileCard key={user._id} user={user} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
