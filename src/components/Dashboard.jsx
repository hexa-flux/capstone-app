import React from "react";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import { AuthContext } from "../auth/AuthContext";

import NavBar from "../routes/navBar";
import DashboardCentral from "./DashboardCentral";
import Register from "./Register";
import Login from "./Login";

export default function Dashboard() {
  const { user, login, logout } = useContext(AuthContext);

  const [showLogin, setShowLogin] = useState(true); // Controls which form to show
  const location = useLocation();

  // Attempt to reload name from navigation state
  // Sign in via the context across the whole app
  useEffect(() => {
    const navName = location?.state?.name;
    if (navName && (!user || user.name !== navName)) {
      const userObj = { name: navName };
      login(userObj);
    }
  }, [location?.state?.name, user, login]); // Only react to location.state changes

  const submitName = (username) => {
    const userObj = { name: username };
    login(userObj);
  };

  const handleRegistered = (payload) => {
    setShowLogin(true);

    // Optionally use payload.username to pre-fill or auto-login:
    // if (payload?.username) submitName(payload.username);
  };

  const handleLogout = () => {
    logout();
    setShowLogin(true);
  };

  return (
    <div>
      <NavBar />
      <h1>Dashboard</h1>

      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <DashboardCentral/>
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
