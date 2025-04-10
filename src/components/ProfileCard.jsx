import React from 'react';

const ProfileCard = ({ user }) => {
  const { name, skillsOffered, skillsWanted, profilePic } = user;
  const defaultProfilePic = "/assets/DefaultPic.png"; 

  return (
    <div className="w-110 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center p-6">
        <img
          src={profilePic || defaultProfilePic} 
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Skills Offered</h3>
          <ul className="mt-2 text-gray-600 list-disc ml-5">
            {skillsOffered.length > 0 ? (
              skillsOffered.map((skill, index) => (
                <li key={index} className="mb-2">
                  {`${skill.skill} (Level: ${skill.level})`}
                </li>
              ))
            ) : (
              <li>No skills offered</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700">Skills Wanted</h3>
          <ul className="mt-2 text-gray-600 list-disc ml-5">
            {skillsWanted.length > 0 ? (
              skillsWanted.map((skill, index) => (
                <li key={index} className="mb-2">
                  {`${skill.skill} (Level: ${skill.level})`}
                </li>
              ))
            ) : (
              <li>No skills wanted</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
