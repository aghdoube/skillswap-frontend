import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const defaultProfilePic = "/assets/DefaultPic.png";

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    profilePicUrl: "",
    skillsOffered: [],
    skillsWanted: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = response.data;
        if (profileData) {
          setProfile({
            username: profileData.username || "",
            email: profileData.email || "",
            bio: profileData.bio || "No bio available",
            location: profileData.location || "Location not specified",
            profilePicUrl: profileData.profilePicUrl || "/default-avatar.png",
            skillsOffered: profileData.skillsOffered || [],
            skillsWanted: profileData.skillsWanted || [],
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
          <div className="bg-blue-600 p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <img
                src={
                  profile.profilePicUrl
                    ? `${import.meta.env.VITE_API_URL}${profile.profilePicUrl}`
                    : defaultProfilePic
                }
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
                onError={(e) => {
                  e.target.src = defaultProfilePic;
                }}
              />

              <div className="md:ml-6 text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-2xl font-bold text-white">
                  {profile.username}
                </h1>
                <p className="text-blue-100">{profile.email}</p>
                <p className="text-blue-100 flex items-center mt-1">
                  <i className="fas fa-map-marker-alt mr-2"></i>{" "}
                  {profile.location}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => navigate("/settings")}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Bio</h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Skills I Can Teach
                </h2>
                {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
                  <div className="space-y-3">
                    {profile.skillsOffered.map((skill, index) => (
                      <div
                        key={`offered-${index}`}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            {skill.skill}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${
                              skill.level === "Beginner"
                                ? "bg-green-100 text-green-800"
                                : skill.level === "Intermediate"
                                ? "bg-blue-100 text-blue-800"
                                : skill.level === "Advanced"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills listed yet</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Skills I Want to Learn
                </h2>
                {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
                  <div className="space-y-3">
                    {profile.skillsWanted.map((skill, index) => (
                      <div
                        key={`wanted-${index}`}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            {skill.skill}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${
                              skill.level === "Beginner"
                                ? "bg-green-100 text-green-800"
                                : skill.level === "Intermediate"
                                ? "bg-blue-100 text-blue-800"
                                : skill.level === "Advanced"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills listed yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
