import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLocation } from 'react-router-dom';

const StartExchange = ({ userId = undefined }) => {
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(userId || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const targetUserId = location.state?.targetUserId;

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

        const skills = await api.get(`/api/skills/${selectedProvider}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        setSkills(skills.data);
      } catch (err) {
        console.error("Error loading data:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedProvider) {
          setIsLoading(true);
          const skills = await api.get(`/api/skills/${selectedProvider}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          setSkills(skills.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading data:", err.response?.data || err.message);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedProvider]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
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

      setMessage("Exchange request sent successfully!");
      setSelectedSkill("");

      toast.success("Your Exchange partner got a notification", {
        style: {
          backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          color: "#ffffff",
          fontWeight: "bold",
          borderRadius: "12px",
          textAlign: "center",
        },
        position: "top-center",
      });
    } catch (err) {
      console.error("Failed to start exchange:", err);
      setMessage("Failed to start exchange.");
      
      toast.error("Failed to send exchange.", {
        style: {
          backgroundColor: "#f87171", 
          color: "#ffffff",
          fontWeight: "bold",
          borderRadius: "12px",
          textAlign: "center",
        },
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200 max-w-lg mx-auto mt-8 mb-20">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800">Start a New Exchange</h3>
      </div>
      
      <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-inner">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="provider" className="text-sm font-medium text-gray-700">Select Partner</label>
            <select
              id="provider"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="block w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
              required
            >
              <option value="">-- Select Partner --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="skill" className="text-sm font-medium text-gray-700">Select Skill</label>
            <select
              id="skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="block w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
              required
              disabled={isLoading || !selectedProvider}
            >
              <option value="">-- Select Skill --</option>
              {skills.map((skillObj) => (
                <option key={skillObj._id} value={skillObj._id}>
                  {skillObj.skill}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !selectedSkill || !selectedProvider}
        className="w-full inline-flex items-center justify-center px-6 py-3 mt-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-teal-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Start Exchange
          </>
        )}
      </button>

      {message && (
        <div className={`mt-6 p-4 rounded-lg text-sm font-medium ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default StartExchange;
