import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, MessageCircle, Book, Award, ChevronRight, X, User } from 'lucide-react';

const ProfileCard = ({ user }) => {
  const { 
    name, 
    skillsOffered, 
    skillsWanted, 
    profilePic, 
    _id, 
    location,
    email,
    bio
  } = user;
  
  const defaultProfilePic = "/assets/DefaultPic.png";
  const navigate = useNavigate();
  const [showContactInfo, setShowContactInfo] = useState(false);

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

  const getLevelBadge = (level) => {
    let levelText = typeof level === 'number' 
      ? ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][level - 1] || level
      : level;
      
    switch (levelText?.toLowerCase()) {
      case 'beginner':
      case '1':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
            Beginner
          </span>
        );
      case 'basic':
      case '2':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></div>
            Basic
          </span>
        );
      case 'intermediate':
      case '3':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1"></div>
            Intermediate
          </span>
        );
      case 'advanced':
      case '4':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></div>
            Advanced
          </span>
        );
      case 'expert':
      case '5':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></div>
            Expert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {levelText || 'Unknown'}
          </span>
        );
    }
  };

  const truncateBio = (text, wordLimit = 20) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        <div className="absolute -bottom-12 inset-x-0 flex justify-center">
          <div className="ring-4 ring-white rounded-full">
            {profilePic ? (
              <img
                src={profilePic}
                alt={`${name}'s profile`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={36} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-14 px-6 pb-6 flex-grow">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          
          {location && (
            <div className="flex items-center justify-center text-gray-500 mt-1">
              <MapPin size={15} className="mr-1" />
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>
        
        {bio && (
          <div className="mb-6 text-center">
            <p className="text-gray-600 text-sm">{truncateBio(bio, 20)}</p>
          </div>
        )}
        
        <div className="space-y-4">
          {skillsOffered && skillsOffered.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Award size={18} className="text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Skills Offered</h3>
              </div>
              
              <div className="space-y-2">
                {skillsOffered.slice(0, 2).map((skillObj, index) => (
                  <div key={`offered-${index}`} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{skillObj.skill}</span>
                    {getLevelBadge(skillObj.level)}
                  </div>
                ))}
                
                {skillsOffered.length > 2 && (
                  <div className="text-xs text-blue-600 font-medium mt-1 text-right">
                    +{skillsOffered.length - 2} more skills
                  </div>
                )}
              </div>
            </div>
          )}
          
          {skillsWanted && skillsWanted.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Book size={18} className="text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Skills Wanted</h3>
              </div>
              
              <div className="space-y-2">
                {skillsWanted.slice(0, 2).map((skillObj, index) => (
                  <div key={`wanted-${index}`} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{skillObj.skill}</span>
                    {getLevelBadge(skillObj.level)}
                  </div>
                ))}
                
                {skillsWanted.length > 2 && (
                  <div className="text-xs text-purple-600 font-medium mt-1 text-right">
                    +{skillsWanted.length - 2} more skills
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {showContactInfo && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Contact Information</h3>
              <button onClick={handleContactToggle} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            
            {email && (
              <div className="flex items-center mt-2">
                <Mail size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-800">{email}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 mb-4 px-6">
        <button
          onClick={handleViewProfile}
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center"
        >
          View Profile
          <ChevronRight size={16} className="ml-1" />
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleMessageUser}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center justify-center"
            title="Message"
          >
            <MessageCircle size={20} />
          </button>
          
          <button
            onClick={handleContactToggle}
            className={`${showContactInfo ? 'bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg transition flex items-center justify-center`}
            title="Contact Info"
          >
            <Mail size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
