import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 
  
  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    
    setError("");
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, data);
      
      console.log("Login successful! Checking profile status...");
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userId", response.data._id);
      
      try {
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`, 
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`
            }
          }
        );
        
        const profile = profileResponse.data;
        const isProfileComplete = profile && 
                                  profile.bio && 
                                  profile.skillsOffered && 
                                  profile.skillsOffered.length > 0;
        
        if (isProfileComplete) {
          navigate("/dashboard");
        } else {
          navigate("/edit-profile");
        }
      } catch (profileErr) {
        console.error("Error checking profile:", profileErr);
        navigate("/edit-profile");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Invalid email or password."); 
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Log in to SkillSwap</h2>
      
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          {...register("email", { required: "Email is required" })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
          Log In
        </button>
      </form>
      
      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
      </div>
      
      <hr className="my-6" />
      
      <div className="text-center">
        <Link to="/signup" className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-600">
          Create New Account
        </Link>
      </div>
    </div>
  );
}