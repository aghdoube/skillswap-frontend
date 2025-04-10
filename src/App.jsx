import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProfileEditForm from "./pages/ProfileEditForm";
import Navbar from "./components/Navbar"; 
import Settings from "./pages/Settings"; 
import UserProfile from "./pages/UserProfile";
function App() {
  
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null;
  };


  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/" />; 
    }
    return children;
  };

  return (
    <Router>
   
      {window.location.pathname !== "/" && <Navbar />} 

      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<LoginForm />} />
        
        <Route path="/signup" element={<Signup />} />
        
        <Route 
          path="/edit-profile" 
          element={
            <ProtectedRoute>
              <ProfileEditForm />
            </ProtectedRoute>
          } 
        />

<Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

<Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
