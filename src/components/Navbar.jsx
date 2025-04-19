import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NotificationDropdown from './NotificationDropdown';
import { Handshake, Globe } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId"); 
    navigate('/'); 
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 p-5">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="flex items-center">
        <Link to="/" className="text-white text-2xl font-semibold flex items-center gap-2">
  
  <Globe size={24} className="text-white" /> {/* Globe icon */}
  SkillSwap
  <Handshake size={24} className="text-white" /> {/* Handshake icon */}
</Link>
        </div>

        <div className="hidden md:flex space-x-6 text-white">
          <Link to="/dashboard" className="hover:text-gray-200">
            Marketplace
          </Link>
          <Link to="/buzzfeed" className="hover:text-gray-200">
            BuzzFeed
          </Link>
          <Link to="/profile" className="hover:text-gray-200">
            My Profile
          </Link>
          <Link to="/exchanges" className="hover:text-gray-200">
            Exchange
          </Link>
          <Link to="/settings" className="hover:text-gray-200">
            Settings
          </Link>
          <Link to="/messages" className="hover:text-gray-200">
            <i className="fas fa-comments" />
          </Link>
          <Link to="#" className="hover:text-gray-200">
            <NotificationDropdown userId={localStorage.getItem("userId")} />
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

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white`}>
        <div className="flex flex-col items-center py-4 space-y-4">
          <Link to="/dashboard" className="hover:text-gray-200">
            Marketplace
          </Link>
          <Link to="/buzzfeed" className="hover:text-gray-200">
            BuzzFeed
          </Link>
          <Link to="/profile" className="hover:text-gray-200">
            My Profile
          </Link>
          <Link to="/exchanges" className="hover:text-gray-200">
            Exchange
          </Link>
          <Link to="/settings" className="hover:text-gray-200">
            Settings
          </Link>
          <Link to="/messages" className="hover:text-gray-200">
            <i className="fas fa-comments" />
          </Link>
          <Link to="/notifications" className="hover:text-gray-200">
            <i className="fas fa-bell" />
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
