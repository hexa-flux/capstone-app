import React from "react";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../auth/AuthContext";

import NavBar from "../routes/navBar";
import EventForm from "../forms/EventForm";

export default function AddEvent() {
  const { user } = useContext(AuthContext);
  const username = user?.name ?? null;

  const [events, setEvents] = useState([]);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!username) {
      setEvents([]);
      return;
    }
    try {
      const raw = sessionStorage.getItem("eventsByUser");
      const all = raw ? JSON.parse(raw) : {};
      const myEvents = Array.isArray(all[username]) ? all[username] : [];
      setEvents(myEvents);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  }, [username]);

  const persistEvent = (newEvent) => {
    if (!username) return;
    try {
      const raw = sessionStorage.getItem("eventsByUser");
      const all = raw ? JSON.parse(raw) : {};
      const userList = Array.isArray(all[username]) ? all[username] : [];
      userList.push(newEvent);
      all[username] = userList;
      sessionStorage.setItem("eventsByUser", JSON.stringify(all));
      setEvents(userList);
      setMsg({ type: "success", text: "Event created." });
      setTimeout(() => setMsg(null), 2500);
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Failed to save event." });
    }
  };

  const handleDelete = (id) => {
    if (!username) return;
    const raw = sessionStorage.getItem("eventsByUser");
    const all = raw ? JSON.parse(raw) : {};
    const filtered = (all[username] || []).filter((e) => e.id !== id);
    all[username] = filtered;
    sessionStorage.setItem("eventsByUser", JSON.stringify(all));
    setEvents(filtered);
  };

  return (
    <div>
      <NavBar />
      <h1>Add Event</h1>

      {!username ? (
        <>
          <p>Please log in to create and view events.</p>

          <button
            onClick={() => {
              // navigate to dashboard and ask it to show the login form
              navigate("/", { state: { openLogin: true } });
            }}
          >
            Go to Login
          </button>
        </>
      ) : (
        <>
          <p>
            Signed in as <strong>{username}</strong>
          </p>

          {msg && (
            <div style={{ color: msg.type === "error" ? "red" : "green" }}>
              {msg.text}
            </div>
          )}

          <EventForm username={username} onSubmit={persistEvent} />

          <hr />

          <h2>Your events</h2>
          {events.length === 0 ? (
            <p>No events yet.</p>
          ) : (
            <ul>
              {events.map((ev) => (
                <li key={ev.id}>
                  <strong>{ev.title}</strong> — {ev.date}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <footer>
        <p>&copy; 2026 page by hexaflux.</p>
      </footer>
    </div>
  );
}
