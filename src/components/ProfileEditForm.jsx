import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileEditForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    bio: "",
    location: "",
    city: "",
    country: "",
    phone: "",
    profilePic: null,
    previewImage: "",
    availability: "",
    skillsOffered: [{ skill: "", level: 1, description: "" }],
    skillsWanted: [{ skill: "", level: 1, description: "" }],
  });

  const skillLevels = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Basic" },
    { value: 3, label: "Intermediate" },
    { value: 4, label: "Advanced" },
    { value: 5, label: "Expert" }
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profileData = response.data;
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          age: profileData.age || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          city: profileData.city || "",
          country: profileData.country || "",
          phone: profileData.phone || "",
          profilePic: null,
          previewImage: profileData.profilePic || "",
          availability: profileData.availability || "",
          skillsOffered: profileData.skillsOffered?.length
            ? profileData.skillsOffered
            : [{ skill: "", level: 1, description: "" }],
          skillsWanted: profileData.skillsWanted?.length
            ? profileData.skillsWanted
            : [{ skill: "", level: 1, description: "" }],
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file, previewImage: URL.createObjectURL(file) });
    }
  };

  const handleSkillChange = (index, field, value, type) => {
    const skills = [...formData[type]];
    skills[index][field] = value;
    setFormData({ ...formData, [type]: skills });
  };

  const addSkill = (type) => {
    setFormData({ 
      ...formData, 
      [type]: [...formData[type], { skill: "", level: 1, description: "" }] 
    });
  };

  const removeSkill = (index, type) => {
    const skills = [...formData[type]];
    if (skills.length > 1) {
      skills.splice(index, 1);
      setFormData({ ...formData, [type]: skills });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const profileFormData = new FormData();
      
      profileFormData.append("name", formData.name);
      profileFormData.append("email", formData.email);
      profileFormData.append("age", formData.age);
      profileFormData.append("bio", formData.bio);
      profileFormData.append("location", formData.location);
      profileFormData.append("city", formData.city);
      profileFormData.append("country", formData.country);
      profileFormData.append("phone", formData.phone);
      profileFormData.append("availability", formData.availability);
      
      profileFormData.append("skillsOffered", JSON.stringify(formData.skillsOffered));
      profileFormData.append("skillsWanted", JSON.stringify(formData.skillsWanted));
      
      if (formData.profilePic) {
        profileFormData.append("profilePic", formData.profilePic);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        profileFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Edit Your Profile</h2>
        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">Personal Info</span>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
          </svg>
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 mx-auto md:mx-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 shadow-lg">
                  {formData.previewImage ? (
                    <img 
                      src={formData.previewImage} 
                      alt="Profile Preview" 
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer shadow hover:bg-blue-700 transition">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </label>
                <input
                  id="profilePic"
                  type="file"
                  name="profilePic"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Your email address"
                  required
                />
              </div>      
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Your city or general location"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="4"
                placeholder="Tell others about yourself, your background, and what you're passionate about"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Availability</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <textarea
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="2"
                  placeholder="When are you available for skill exchanges? (e.g., Weekends, Evenings, etc.)"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Skills You Can Offer</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded">Teaching</span>
          </div>
          
          {formData.skillsOffered.map((skill, index) => (
            <div key={`offered-${index}`} className="mb-6 p-5 bg-indigo-50 bg-opacity-50 rounded-lg border border-indigo-100">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-indigo-800 mb-3">Skill #{index + 1}</h4>
                {formData.skillsOffered.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index, "skillsOffered")}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, "skill", e.target.value, "skillsOffered")}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="What skill can you offer?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Proficiency Level</label>
                  <select
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, "level", parseInt(e.target.value), "skillsOffered")}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    {skillLevels.map((level) => (
                      <option key={`offered-level-${level.value}`} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={skill.description || ""}
                    onChange={(e) => handleSkillChange(index, "description", e.target.value, "skillsOffered")}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    rows="2"
                    placeholder="Describe your experience with this skill and how you could teach it"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addSkill("skillsOffered")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 py-2 px-4 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Another Skill
          </button>
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Skills You Want to Learn</h3>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded">Learning</span>
          </div>
          
          {formData.skillsWanted.map((skill, index) => (
            <div key={`wanted-${index}`} className="mb-6 p-5 bg-emerald-50 bg-opacity-50 rounded-lg border border-emerald-100">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-emerald-800 mb-3">Skill #{index + 1}</h4>
                {formData.skillsWanted.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index, "skillsWanted")}
                    className="text-emerald-600 hover:text-emerald-800 flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, "skill", e.target.value, "skillsWanted")}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    placeholder="What skill do you want to learn?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Current Level</label>
                  <select
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, "level", parseInt(e.target.value), "skillsWanted")}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  >
                    {skillLevels.map((level) => (
                      <option key={`wanted-level-${level.value}`} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={skill.description || ""}
                    onChange={(e) => handleSkillChange(index, "description", e.target.value, "skillsWanted")}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    rows="2"
                    placeholder="Describe what aspects of this skill you want to learn"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addSkill("skillsWanted")}
            className="flex items-center text-emerald-600 hover:text-emerald-800 py-2 px-4 border border-dashed border-emerald-300 rounded-lg hover:bg-emerald-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Another Skill
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row-reverse gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-base font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition"
          >
            Save Profile
          </button>
          <button
            type="button"
            className="bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-lg text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;