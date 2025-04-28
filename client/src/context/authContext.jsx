import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Export the context so it can be used in other files
export const AuthContext = createContext();

// ✅ Custom hook for using the AuthContext
export const useAuth = () => useContext(AuthContext);

// 🔓 Function to decode JWT token and get user role
const decodeToken = (token) => {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.role;
  } catch (err) {
    console.error("Token decoding failed", err);
    return null;
  }
};

// 🌐 AuthProvider component that wraps your app and provides auth state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState(null); // optional but helpful for other uses

  // 🔍 Check token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const decodedRole = decodeToken(token);
      if (decodedRole) {
        setIsAdmin(decodedRole === 'admin');
        setRole(decodedRole);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setRole(null);
      }
    }
  }, []);

  // ✅ Login method
  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    const decodedRole = decodeToken(token);
    if (decodedRole) {
      setIsAdmin(decodedRole === 'admin');
      setRole(decodedRole);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setRole(null);
    }
  };

  // 🚪 Logout method
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");   // ✅ Remove token
    localStorage.removeItem("role"); 
    setIsAuthenticated(false);
    setIsAdmin(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
