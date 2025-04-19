import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, MapPin, Info } from "lucide-react";
import { toast } from "sonner";

const SocialLoginButtons = ({ onMockLogin }) => {
  const handleSocialLogin = (provider) => {
    console.log(`Mock ${provider} signup initiated`);
    
    setTimeout(() => {
      if (onMockLogin) {
        const mockUserData = {
          token: "mock-auth-token-123456",
          name: provider === "Google" ? "Jane Smith" : "John Doe",
          _id: `mock-user-id-${Date.now()}`,
        };
        onMockLogin(mockUserData);
      }
    }, 1000);
  };

  return (
    <div className="mt-6">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or continue with</span>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button 
          type="button"
          onClick={() => handleSocialLogin("Google")}
          className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-all duration-300 w-full"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
        
        <button 
          type="button"
          onClick={() => handleSocialLogin("Facebook")}
          className="flex items-center justify-center bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-all duration-300 w-full"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
          </svg>
          Facebook
        </button>
      </div>
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData
      );

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userId", response.data._id);

      toast.success(`Welcome to SkillSwapp, ${response.data.name}!`, {
        style: {
          backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)", 
          color: "#ffffff",
          fontWeight: "bold",
          borderRadius: "12px",
          textAlign: "center",
        },
        position: "top-center", 
      });

      navigate("/edit-profile");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialMockSignup = (userData) => {
    localStorage.setItem("authToken", userData.token);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userId", userData._id);
    
    toast.success(`Welcome to SkillSwapp, ${userData.name}!`, {
      style: {
        backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)", 
        color: "#ffffff",
        fontWeight: "bold",
        borderRadius: "12px",
        textAlign: "center",
      },
      position: "top-center", 
    });
    
    navigate("/edit-profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center py-10 px-4">
      
      <header className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">SkillSwapp</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          A place where learners and mentors meet. Share your skills, learn new ones, and grow together.
        </p>
        <ul className="text-left text-gray-700 text-lg space-y-3 list-none mx-auto max-w-md">
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-3"></span>
            Sign up for free and create your SkillSwap profile
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-purple-500 mr-3"></span>
            List the skills you offer and want to learn
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-indigo-500 mr-3"></span>
            Connect with people ready to swap knowledge
          </li>
        </ul>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField icon={<User size={18} />} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <InputField icon={<Mail size={18} />} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <InputField icon={<Lock size={18} />} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <button
            type="submit"
            className="w-full bg-gradient-to-r text-white bg-gradient-to-r from-pink-400 to-purple-400  py-4 rounded-lg font-semibold text-lg transition-transform duration-300 hover:scale-105 shadow-md flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <SocialLoginButtons onMockLogin={handleSocialMockSignup} />

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/home" className="text-blue-600 hover:underline font-medium">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="text-gray-400 mr-3">{icon}</div>
    <input
      className="w-full outline-none border-none bg-transparent placeholder-gray-400 text-gray-700"
      {...props}
    />
  </div>
);

export default Signup;