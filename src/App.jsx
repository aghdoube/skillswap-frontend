import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProfileEditForm from "./components/ProfileEditForm";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import ProfileDetail from "./components/ProfileDetail";
import BuzzFeed from "./pages/BuzzFeed";
import Footer from "./components/Footer";
import ChatApp from "./components/ChatApp";
import ExchangeList from "./pages/ExchangeList";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();

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
    <>
{!["/", "/login", "/signup"].includes(location.pathname) && <Navbar />}

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
          path="/messages/:receiverId?"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buzzfeed"
          element={
            <ProtectedRoute>
              <BuzzFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfileDetail />
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
        <Route
          path="/exchanges"
          element={
            <ProtectedRoute>
              <ExchangeList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
