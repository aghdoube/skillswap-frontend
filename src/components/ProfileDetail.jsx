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
      <button
        onClick={handleGoBack}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
      >
        ← Back to Dashboard
      </button>

      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden border-t-[100px] border-transparent"
        style={{
          borderImage: "linear-gradient(to right, #2563eb, #9333ea)",
          borderImageSlice: 1,
        }}
      >
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex flex-col items-center border-r border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <img
              src={profilePic || defaultProfilePic}
              alt={`${name}'s profile`}
              className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-white shadow-md"
            />
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">
                About
              </h2>
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

        <div className="md:flex">
          <div className="md:w-1/2 p-6 border-r border-gray-200">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">
              Skills Offered
            </h2>
            {skillsOffered && skillsOffered.length > 0 ? (
              <ul className="text-gray-700">
                {skillsOffered.map((skill, index) => (
                  <li
                    key={index}
                    className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div className="font-semibold text-gray-800">
                      {skill.skill}
                    </div>
                    <div className="mt-2">
                      {renderSkillLevelBadge(skill.level)}
                    </div>
                    {skill.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {skill.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No skills offered.</p>
            )}
          </div>

          <div className="md:w-1/2 p-6">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">
              Skills Wanted
            </h2>
            {skillsWanted && skillsWanted.length > 0 ? (
              <ul className="text-gray-700">
                {skillsWanted.map((skill, index) => (
                  <li
                    key={index}
                    className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div className="font-semibold text-gray-800">
                      {skill.skill}
                    </div>
                    <div className="mt-2">
                      {renderSkillLevelBadge(skill.level)}
                    </div>
                    {skill.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {skill.description}
                      </p>
                    )}
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
