import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileEditForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    profilePic: null,
    skillsOffered: [{ skill: "", level: "Beginner" }],
    skillsWanted: [{ skill: "", level: "Beginner" }]
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
              Authorization: `Bearer ${token}`
            }
          }
        );

        const profileData = response.data;
        if (profileData) {
          setFormData({
            bio: profileData.bio || "",
            location: profileData.location || "",
            profilePic: null,
            skillsOffered: profileData.skillsOffered && profileData.skillsOffered.length > 0 
              ? profileData.skillsOffered 
              : [{ skill: "", level: "Beginner" }],
            skillsWanted: profileData.skillsWanted && profileData.skillsWanted.length > 0 
              ? profileData.skillsWanted 
              : [{ skill: "", level: "Beginner" }]
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePic: e.target.files[0]
    });
  };

  const handleSkillChange = (index, field, value, type) => {
    const skills = [...formData[type]];
    skills[index][field] = value;
    setFormData({
      ...formData,
      [type]: skills
    });
  };

  const addSkill = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { skill: "", level: "Beginner" }]
    });
  };

  const removeSkill = (index, type) => {
    const skills = [...formData[type]];
    if (skills.length > 1) {
      skills.splice(index, 1);
      setFormData({
        ...formData,
        [type]: skills
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      
      const profileFormData = new FormData();
      profileFormData.append("bio", formData.bio);
      profileFormData.append("location", formData.location);
      
      if (formData.profilePic) {
        profileFormData.append("profilePic", formData.profilePic);
      }
      
      profileFormData.append("skillsOffered", JSON.stringify(formData.skillsOffered));
      profileFormData.append("skillsWanted", JSON.stringify(formData.skillsWanted));

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        profileFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Your Profile</h2>
        <p className="text-gray-600 mb-6 text-center">
          Please provide the following information to complete your profile.
        </p>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
       
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Tell us about yourself"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your city and country"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Profile Picture (optional)</label>
            <input
              type="file"
              name="profilePic"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Skills You Can Offer</label>
            {formData.skillsOffered.map((skill, index) => (
              <div key={`offered-${index}`} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skill.skill}
                  onChange={(e) => handleSkillChange(index, "skill", e.target.value, "skillsOffered")}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Skill name"
                  required
                />
                <select
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, "level", e.target.value, "skillsOffered")}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                {formData.skillsOffered.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index, "skillsOffered")}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSkill("skillsOffered")}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add Skill
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Skills You Want to Learn</label>
            {formData.skillsWanted.map((skill, index) => (
              <div key={`wanted-${index}`} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skill.skill}
                  onChange={(e) => handleSkillChange(index, "skill", e.target.value, "skillsWanted")}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Skill name"
                  required
                />
                <select
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, "level", e.target.value, "skillsWanted")}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                {formData.skillsWanted.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index, "skillsWanted")}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSkill("skillsWanted")}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add Skill
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;