import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Mail, MessageCircle } from 'lucide-react';

const ProfileCard = ({ user }) => {
  const { 
    name, 
    skillsOffered, 
    skillsWanted, 
    profilePic, 
    _id, 
    location,
    joinDate,
    email,
    bio
  } = user;
  
  const defaultProfilePic = "/assets/DefaultPic.png";
  const navigate = useNavigate();
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  const formattedDate = joinDate ? new Date(joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  }) : 'N/A';
  
  const primarySkillOffered = skillsOffered && skillsOffered.length > 0 ? skillsOffered[0] : null;
  const primarySkillWanted = skillsWanted && skillsWanted.length > 0 ? skillsWanted[0] : null;
  
  const handleViewProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${_id}`);
  };
  
  const handleContactToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContactInfo(!showContactInfo);
  };
  
  const handleMessageUser = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/messages/${_id}`);
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="w-[370px] h-[450px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        <div className="absolute left-6 -bottom-10">
          <img
            src={profilePic || defaultProfilePic}
            alt={`${name}'s profile`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
          />
        </div>
      </div>
      
      <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{name}</h2>
              {location && (
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{location}</span>
                </div>
              )}
            </div>
          </div>
          
          {bio && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm line-clamp-2">{bio}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {primarySkillOffered && (
              <div className="flex items-center">
                <span className="text-xs font-medium mr-1">Offers:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(primarySkillOffered.level)}`}>
                  {primarySkillOffered.skill}
                </span>
              </div>
            )}
            
            {primarySkillWanted && (
              <div className="flex items-center">
                <span className="text-xs font-medium mr-1">Wants:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(primarySkillWanted.level)}`}>
                  {primarySkillWanted.skill}
                </span>
              </div>
            )}
          </div>
          
          {showContactInfo && email && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <Mail size={16} className="text-gray-600 mr-2" />
                <span className="text-sm text-gray-800">{email}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleViewProfile}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition text-sm"
          >
            View Profile
          </button>
          
          <button
            onClick={handleMessageUser}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded transition text-sm"
          >
            <MessageCircle size={18} />
          </button>
          
          <button
            onClick={handleContactToggle}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded transition text-sm"
          >
            <Mail size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;