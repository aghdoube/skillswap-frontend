import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.location.href = '/login'; 
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white text-2xl font-semibold">
            SkillSwap
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 text-white">
          <Link to="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/browse" className="hover:text-gray-200">
            Browse
          </Link>
          <Link to="/profile" className="hover:text-gray-200">
            Profile
          </Link>
          <Link to="/messages" className="hover:text-gray-200">
            Messages
          </Link>
          <Link to="/settings" className="hover:text-gray-200">
            Settings
          </Link>

          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400"
          >
            Logout
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white text-2xl"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-blue-600 text-white`}>
        <div className="flex flex-col items-center py-4 space-y-4">
          <Link to="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/browse" className="hover:text-gray-200">
            Browse
          </Link>
          <Link to="/profile" className="hover:text-gray-200">
            Profile
          </Link>
          <Link to="/messages" className="hover:text-gray-200">
            Messages
          </Link>
          <Link to="/settings" className="hover:text-gray-200">
            Settings
          </Link>

          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
