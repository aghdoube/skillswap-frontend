import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Mail, MessageCircle, Book, Award, ChevronRight, X, User } from 'lucide-react';

import axios from "axios";

const renderSkillLevelBadge = (level) => {
  let levelText = "";

  const numericLevel = Number(level);
  const isNumeric = !isNaN(numericLevel);

  if (isNumeric) {
    if (numericLevel <= 2) levelText = "Beginner";
    else if (numericLevel <= 4) levelText = "Basic";
    else if (numericLevel <= 6) levelText = "Intermediate";
    else if (numericLevel <= 8) levelText = "Advanced";
    else levelText = "Expert";
  } else {
    levelText = level;
  }

  switch (levelText.toLowerCase()) {
    case "beginner":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
          Beginner
        </span>
      );
    case "basic":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
          Basic
        </span>
      );
    case "intermediate":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1" />
          Intermediate
        </span>
      );
    case "advanced":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1" />
          Advanced
        </span>
      );
    case "expert":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1" />
          Expert
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {levelText || "Unknown"}
        </span>
      );
  }
};

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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setError("Failed to load profile details. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate("/dashboard");
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

  const {
    name,
    profilePic,
    bio,
    location,
    skillsOffered,
    skillsWanted,
    availability,
    contactInfo,
  } = profile;
  const defaultProfilePic = "/assets/DefaultPic.png";

  return (
    <div className="max-w-6xl mx-auto p-8">
     <div className="w-full flex items-center mb-6">
     <button
  onClick={handleGoBack}
  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded-md transition-colors duration-150"
>
  <span className="text-base">←</span>
  <span>Back to Dashboard</span>
</button>

</div>

      <div className="relative">
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden border-t-[65px] border-transparent mt-20"
      style={{
        borderImage: "linear-gradient(to right, #2563eb, #9333ea)",
        borderImageSlice: 1,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-[65px] flex justify-center items-center px-8 pointer-events-none">
  <h2 className="text-white text-2xl font-bold drop-shadow-md">{name}’s Profile</h2>
</div>

        
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex flex-col items-center   ">
          <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4">
  <img
    src={profilePic || defaultProfilePic}
    alt={`${name}'s profile`}
    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
  />
</div>

            <h1 className="text-2xl font-bold text-center text-gray-800">
              {name}
            </h1>
            {location && (
            <div className="flex items-center justify-center text-gray-500 mt-1">
              <MapPin size={15} className="mr-1" />
              <span className="text-sm">{location}</span>
            </div>
          )}
          </div>

          <div className="md:w-2/3 p-6">
            <div className="mb-6 mt-16">
             
              <p className="text-gray-700">{bio || "No bio available."}</p>
            </div>

            {availability && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">
                  Availability
                </h2>
                <p className="text-gray-700">{availability}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(149,91,255,0.1)] transition-all duration-300 border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Skills Offered
      </h2>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
        {skillsOffered?.length || 0} skills
      </span>
    </div>

    {skillsOffered && skillsOffered.length > 0 ? (
      <div className="space-y-4">
        {skillsOffered.map((skill, index) => (
          <div
            key={index}
            className="group p-5 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-purple-100 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
                  {skill.skill}
                </h3>
                {skill.description && (
                  <p className="mt-1 text-sm text-gray-500 group-hover:text-gray-700">
                    {skill.description}
                  </p>
                )}
              </div>
              <div className="mt-1">
                {renderSkillLevelBadge(skill.level)}
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700">
                  Available
                </span>
                
              </div>
             
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500">No skills offered yet</p>
        <button className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-800">
          Add your first skill +
        </button>
      </div>
    )}
  </div>

  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(149,91,255,0.1)] transition-all duration-300 border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        Skills Wanted
      </h2>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
        {skillsWanted?.length || 0} skills
      </span>
    </div>

    {skillsWanted && skillsWanted.length > 0 ? (
      <div className="space-y-4">
        {skillsWanted.map((skill, index) => (
          <div
            key={index}
            className="group p-5 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-pink-100 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-pink-700 transition-colors">
                  {skill.skill}
                </h3>
                {skill.description && (
                  <p className="mt-1 text-sm text-gray-500 group-hover:text-gray-700">
                    {skill.description}
                  </p>
                )}
              </div>
              <div className="mt-1">
                {renderSkillLevelBadge(skill.level)}
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700">
                  Available
                </span>
             
              </div>
             
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Target className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500">No skills wanted yet</p>
        <button className="mt-3 text-sm font-medium text-pink-600 hover:text-pink-800">
          Add desired skill +
        </button>
      </div>
    )}
  </div>
</div>
      </div>
    </div>
    </div>
  );
};

export default ProfileDetail;
