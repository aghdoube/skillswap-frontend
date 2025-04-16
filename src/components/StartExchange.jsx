import React, { useState, useEffect } from "react";
import axios from "axios";

const StartExchange = () => {
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [message, setMessage] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, usersRes] = await Promise.all([
          api.get("/api/skills"),
          api.get("/api/auth/profiles", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
                  ]);
        setSkills(skillsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/exchanges",
        {
          providerId: selectedProvider,
          skillId: selectedSkill,
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
            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {skill.title}
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
