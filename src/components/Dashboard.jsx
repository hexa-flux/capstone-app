import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import NavBar from "../routes/navBar";
import Register from "./Register";
import Login from "./Login";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [showLogin, setShowLogin] = useState(true); // Controls which form to show
  const location = useLocation();

  // Attempt to reload name from navigation state
  useEffect(() => {
    const navName = location?.state?.name;
    const storedName = sessionStorage.getItem("name"); // Session storage fallback
    if (navName) {
      setName(location.state.name);
    } else if (storedName) {
      setName(storedName);
    }
  }, [location?.state]); // Only react to location.state changes

  const submitName = (username) => {
    setName(username);
  };

  const handleRegistered = (payload) => {
    setShowLogin(true);

    // if (payload?.username) {...}
  };

  const handleLogout = () => {
    setName("");
    sessionStorage.removeItem("name");
    setShowLogin(true);
  };

  return (
    <div>
      <NavBar />
      <h1>Dashboard</h1>

      {name ? (
        <>
          <h2>Welcome, {name}</h2>
          <button id="LogoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          {showLogin ? (
            <>
              <h2>Login</h2>
              <Login submitUsername={submitName} />
            </>
          ) : (
            <>
              <h2>Register</h2>
              <Register onRegistered={handleRegistered} />
            </>
          )}

          {/* Toggle links/buttons to switch between Login and Register */}
          <div>
            {showLogin ? (
              <>
                <span>Don't have an account? </span>
                <button onClick={() => setShowLogin(false)}>
                  Go to Register
                </button>
              </>
            ) : (
              <>
                <span>Already have an account? </span>
                <button onClick={() => setShowLogin(true)}>Go to Login</button>
              </>
            )}
          </div>
        </>
      )}

      <footer>
        <p>&copy; 2026 page by hexaflux.</p>
      </footer>
    </div>
  );
}
