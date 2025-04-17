import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';

const StartExchange = () => {
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const targetUserId = location.state?.targetUserId;

  console.log("User to exchange with:", targetUserId);

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get("/api/auth/profiles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const users = usersRes.data;
        setUsers(users);
        console.log("Users loaded:", users);
        const allSkills = users.flatMap((user) => user.skillsOffered || []);
        const uniqueSkills = allSkills.filter(
          (skillObj, index, self) =>
            skillObj &&
            self.findIndex((s) => s.skill === skillObj.skill) === index
        );

        setSkills(uniqueSkills);
      } catch (err) {
        console.error("Error loading data:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("All users with skills:", users);

      await api.post(
        "/api/exchanges",
        {
          provider: selectedProvider,
          skill: selectedSkill,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setMessage("Exchange started successfully!");
    } catch (err) {
      console.error("Failed to start exchange:", err);
      setMessage("Failed to start exchange.");
    }
  };
  console.log("Submitting exchange:", {
    providerId: selectedProvider,
    skillId: selectedSkill,
  });

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Start a New Exchange</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Select Provider:</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Select Skill:</label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Select Skill --</option>
            {skills.map((skillObj) => (
              <option key={skillObj._id} value={skillObj._id}>
                {skillObj.skill}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Start Exchange
        </button>
      </form>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default StartExchange;
