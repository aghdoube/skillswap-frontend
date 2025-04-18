import React, { useState } from "react";
import ProfileEditForm from "../components/ProfileEditForm";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
    const navigate = useNavigate();
  

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto p-6">
       <div className="w-full flex items-center mb-6">
     <button
  onClick={handleGoBack}
  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded-md transition-colors duration-150"
>
  <span className="text-base">←</span>
  <span>Back to Dashboard</span>
</button>

</div>
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

export default Settings;
