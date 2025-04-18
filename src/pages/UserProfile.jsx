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
            profilePicUrl: profileData.profilePic || "",
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

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="w-full flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded-md transition-colors duration-150"
        >
          <span className="text-base">←</span>
          <span>Back to Dashboard</span>
        </button>
      </div>
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-pink-500  to-purple-800">
                <img
                  src={
                    profile.profilePicUrl
                      ? profile.profilePicUrl.includes("http")
                        ? profile.profilePicUrl
                        : `${
                            import.meta.env.VITE_API_URL
                          }/${profile.profilePicUrl.replace(/^\//, "")}`
                      : defaultProfilePic
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    console.error("Error loading profile image:", e.target.src);
                    e.target.src = defaultProfilePic;
                  }}
                />
              </div>

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
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium  hover:text-purple-800 transition"
              >
                Update Info{" "}
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
                        skill.level === "1"
                          ? "bg-green-100 text-green-800"
                          : skill.level === "2"
                          ? "bg-blue-100 text-blue-800"
                          : skill.level === "3"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800"
                      }`}
                          >
                            {skill.level === "1"
                              ? "Beginner"
                              : skill.level === "2"
                              ? "Intermediate"
                              : skill.level === "3"
                              ? "Advanced"
                              : "Expert"}
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
