import React from "react";
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../auth/AuthContext";

import NavBar from "../routes/navBar";
import DashboardCentral from "./DashboardCentral";
import Register from "../forms/Register";
import Login from "../forms/Login";

export default function Dashboard() {
  const { user, login, logout } = useContext(AuthContext);

  const [showLogin, setShowLogin] = useState(true); // Controls which form to show
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Read primitive values from location.state (keeps deps stable)
    const navName = location?.state?.name;
    const openLogin = Boolean(location?.state?.openLogin);

    // If navigation provided a name and it's different from current user, sign in once.
    if (navName && (!user || user.name !== navName)) {
      login({ name: navName });

      // Clear navigation state so this doesn't re-run on refresh/back.
      navigate(location.pathname, { replace: true, state: {} });
      return; // done
    }

    // If navigation requested the login form, and it's not already shown, open it.
    if (openLogin && !showLogin) {
      setShowLogin(true);

      // Clear the flag from history so it won't trigger again.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    location?.state?.name, // primitive string | undefined
    location?.state?.openLogin, // primitive boolean-ish | undefined
    user, // object or null
    login, // stable (useCallback) function from provider
    showLogin, // local UI state
    navigate,
    location.pathname,
  ]);

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
      <header>
        <NavBar />
      </header>
      <hr className="hr-large"></hr>
      <h1>Dashboard</h1>
      <hr className="hr-medium"></hr>

      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <DashboardCentral />
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
        <hr className="hr-medium"></hr>
        <p>&copy; 2026 page by hexaflux.</p>
      </footer>
    </div>
  );
}
