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
    <div className="max-w-lg mx-auto my-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-6 text-white">
          <h2 className="text-2xl font-semibold">Start Exchange</h2>
          <p className="text-indigo-100 mt-1">Connect with experts and learn new skills</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                Select Exchange Partner
              </label>
              <div className="relative">
                <select
                  id="provider"
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select a partner</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="skill" className="block text-sm font-medium text-gray-700">
                Select a Skill
              </label>
              <div className="relative">
                <select
                  id="skill"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  disabled={isLoading || !selectedProvider}
                >
                  <option value="">Select a skill</option>
                  {skills.map((skillObj) => (
                    <option key={skillObj._id} value={skillObj._id}>
                      {skillObj.skill}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {!selectedProvider && (
                <p className="text-sm text-gray-500 mt-1">Select a partner to see their available skills</p>
              )}
            </div>
          </form>
          
          {message && (
            <div className={`mt-6 px-4 py-3 rounded-lg text-sm font-medium ${
              message.includes("success") 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              <div className="flex items-center">
                <svg className={`w-5 h-5 mr-2 ${message.includes("success") ? "text-green-500" : "text-red-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  {message.includes("success") ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
                {message}
              </div>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedSkill || !selectedProvider}
            className="w-full mt-6 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
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
              "Start Exchange"
            )}
          </button>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your exchange partner will receive a notification. Once they accept, you can start learning!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExchange;