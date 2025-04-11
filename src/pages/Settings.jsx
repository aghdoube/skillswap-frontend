import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <div className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg">
          <ul>
            <li
              className={`py-2 px-4 cursor-pointer ${activeSection === "profile" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => handleSectionChange("profile")}
            >
              Edit Profile
            </li>
            <li
              className={`py-2 px-4 cursor-pointer ${activeSection === "password" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => handleSectionChange("password")}
            >
              Change Password
            </li>
            <li
              className={`py-2 px-4 cursor-pointer ${activeSection === "privacy" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => handleSectionChange("privacy")}
            >
              Privacy Settings
            </li>
          </ul>
        </div>

        <div className="w-full md:w-3/4 p-6 bg-white rounded-lg shadow-lg">
          {activeSection === "profile" && <ProfileEditForm />}
          {activeSection === "password" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your new password"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Confirm your new password"
                  />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg">Change Password</button>
              </form>
            </div>
          )}
          {activeSection === "privacy" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Profile Visibility</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Receive Notifications</label>
                  <div className="flex items-center">
                    <input type="checkbox" id="notifications" className="mr-2" />
                    <label htmlFor="notifications" className="text-gray-700">Enable Notifications</label>
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg">Save Changes</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Your Profile</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your email address"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your age"
              min="13"
              max="120"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your phone number"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your city"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your country"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full address or general location"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Tell others about yourself"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Availability</label>
            <textarea
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="When are you available for skill exchanges? (e.g., Weekends, Evenings, etc.)"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              {formData.previewImage && (
                <img src={formData.previewImage} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border" />
              )}
              <input
                type="file"
                name="profilePic"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills You Can Offer</h3>
          
          {formData.skillsOffered.map((skill, index) => (
            <div key={`offered-${index}`} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, "skill", e.target.value, "skillsOffered")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="What skill can you offer?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Proficiency Level</label>
                  <select
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, "level", parseInt(e.target.value), "skillsOffered")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {skillLevels.map((level) => (
                      <option key={`offered-level-${level.value}`} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={skill.description || ""}
                    onChange={(e) => handleSkillChange(index, "description", e.target.value, "skillsOffered")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="2"
                    placeholder="Describe your experience with this skill"
                  />
                </div>
              </div>
              
              {formData.skillsOffered.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index, "skillsOffered")}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove Skill
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addSkill("skillsOffered")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Another Skill
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills You Want to Learn</h3>
          
          {formData.skillsWanted.map((skill, index) => (
            <div key={`wanted-${index}`} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, "skill", e.target.value, "skillsWanted")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="What skill do you want to learn?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Current Level</label>
                  <select
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, "level", parseInt(e.target.value), "skillsWanted")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {skillLevels.map((level) => (
                      <option key={`wanted-level-${level.value}`} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={skill.description || ""}
                    onChange={(e) => handleSkillChange(index, "description", e.target.value, "skillsWanted")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="2"
                    placeholder="Describe what you want to learn about this skill"
                  />
                </div>
              </div>
              
              {formData.skillsWanted.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index, "skillsWanted")}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove Skill
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addSkill("skillsWanted")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Another Skill
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;