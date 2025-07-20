// web/src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom"; // Don't forget to import useNavigate!

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // `loading` starts as true as we're checking for a user
  const navigate = useNavigate(); // Initialize useNavigate here

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          // Attempt to parse the stored user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        // If parsing fails (e.g., corrupted data), clear localStorage
        // and ensure user is null to prevent inconsistent state.
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        // Always set loading to false once the check is complete, regardless of outcome
        setLoading(false);
      }
    };

    checkUser();
  }, []); // Empty dependency array ensures this runs only once on mount
  
  const login = (userData) => {
    // userData MUST include a 'token' property from your backend's login response
    // Example: userData = { id: '...', email: '...', token: 'your.jwt.token' }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // ... rest of your login logic
  };
  const logout = () => {
    localStorage.removeItem("user"); // Clear user data from local storage
    setUser(null); // Clear user data from state
    navigate("/"); // Redirect to the landing page after logging out
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
