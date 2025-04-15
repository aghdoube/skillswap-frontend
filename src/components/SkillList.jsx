import React from 'react';

const SkillsList = ({ title, skills }) => (
  <div className="mb-6">
    <h3 className="text-md font-medium text-gray-700 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <span key={index} className={`bg-${title === "Skills You Offer" ? 'green' : 'blue'}-100 text-${title === "Skills You Offer" ? 'green' : 'blue'}-800 text-sm px-3 py-1 rounded-full`}>
            {skill.skill}
          </span>
        ))
      ) : (
        <p className="text-sm text-gray-500">No skills added yet</p>
      )}
    </div>
  </div>
);

export default SkillsList;
