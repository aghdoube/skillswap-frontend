import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileDetail = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            
          },
          

        });
       
        setProfile(response.data);
        console.log(localStorage.getItem('authToken'));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile details:', err);
        setError('Failed to load profile details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={handleGoBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <div className="text-xl mb-4">Profile not found</div>
        <button 
          onClick={handleGoBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { name, profilePic, bio, email, location, skillsOffered, skillsWanted, availability, contactInfo } = profile;
  const defaultProfilePic = "/assets/DefaultPic.png";

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button 
        onClick={handleGoBack}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex flex-col items-center border-r border-gray-200">
            <img
              src={profilePic || defaultProfilePic}
              alt={`${name}'s profile`}
              className="w-40 h-40 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-bold text-center">{name}</h1>
            {location && <p className="text-gray-600 mt-2">{location}</p>}
          </div>

          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">About</h2>
              <p className="text-gray-700">{bio || "No bio available."}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Contact Information</h2>
              <p className="text-gray-700"><strong>Email:</strong> {email}</p>
              {contactInfo && Object.entries(contactInfo).map(([key, value]) => (
                <p key={key} className="text-gray-700">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </p>
              ))}
            </div>

            {availability && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Availability</h2>
                <p className="text-gray-700">{availability}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        <div className="md:flex">
          <div className="md:w-1/2 p-6 border-r border-gray-200">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Skills Offered</h2>
            {skillsOffered && skillsOffered.length > 0 ? (
              <ul className="text-gray-700">
                {skillsOffered.map((skill, index) => (
                  <li key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{skill.skill}</div>
                    <div className="flex items-center mt-1">
                      <span className="mr-2">Level: {skill.level}/10</span>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    {skill.description && <p className="mt-2 text-sm text-gray-600">{skill.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No skills offered.</p>
            )}
          </div>

          <div className="md:w-1/2 p-6">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Skills Wanted</h2>
            {skillsWanted && skillsWanted.length > 0 ? (
              <ul className="text-gray-700">
                {skillsWanted.map((skill, index) => (
                  <li key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{skill.skill}</div>
                    <div className="flex items-center mt-1">
                      <span className="mr-2">Level: {skill.level}/10</span>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    {skill.description && <p className="mt-2 text-sm text-gray-600">{skill.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No skills wanted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;