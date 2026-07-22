import React, { useContext } from "react";
import { useState } from "react";

import { AuthContext } from "../auth/AuthContext";

import NavBar from "../routes/navBar";

export default function AddEvent() {
  const { user } = useContext(AuthContext);
  const loggedIn = Boolean(user)

  return (
    <div>
      <NavBar />
      <h1>Add Event</h1>

      { loggedIn ? (
        <>
          <p>A form for adding events goes here.</p>
        </>
      ) : (
        <>
          <p>Please login to add events.</p>
        </>
      )}

      <footer>
        <p>&copy; 2026 page by hexaflux.</p>
      </footer>
    </div>
  );
}
