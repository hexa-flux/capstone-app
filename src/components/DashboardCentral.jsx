import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import EventEditForm from "../forms/EventEditForm";

import "./DashboardCentral.css"

/** ordinal suffix helper */
function dayOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/** Format YYYY-MM-DD -> "12th July 2025" */
function formatDateHeading(yyyyMmDd) {
  if (!yyyyMmDd || yyyyMmDd === "unscheduled") return "Unscheduled";
  const parts = yyyyMmDd.split("-");
  if (parts.length !== 3) return yyyyMmDd;
  const [y, m, d] = parts.map((p) => parseInt(p, 10));
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return yyyyMmDd;
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const day = d;
  const suffix = dayOrdinal(day);
  const month = monthNames[m - 1] || String(m);
  return `${day}${suffix} ${month} ${y}`;
}

export default function DashboardCentral() {
  const { user } = useContext(AuthContext);
  const username = user?.name ?? null;

  const [grouped, setGrouped] = useState({}); // { date: [events] }
  const [dates, setDates] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Load and group events for the current user
  const loadAndGroup = () => {
    if (!username) {
      setGrouped({});
      setDates([]);
      return;
    }

    try {
      const raw = sessionStorage.getItem("eventsByUser");
      const all = raw ? JSON.parse(raw) : {};
      const myEvents = Array.isArray(all[username]) ? all[username] : [];

      const map = myEvents.reduce((acc, ev) => {
        const d = ev.date || "unscheduled";
        if (!acc[d]) acc[d] = [];
        acc[d].push(ev);
        return acc;
      }, {});

      // Sort events by time within each date
      Object.keys(map).forEach((d) => {
        map[d].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      });

      // Sort date keys ascending, put "unscheduled" last
      const dateKeys = Object.keys(map).sort((a, b) => {
        if (a === "unscheduled") return 1;
        if (b === "unscheduled") return -1;
        return a.localeCompare(b);
      });

      setGrouped(map);
      setDates(dateKeys);
      setError(null);
    } catch (err) {
      console.error("Failed to load events", err);
      setGrouped({});
      setDates([]);
      setError("Failed to load events.");
    }
  };

  useEffect(() => {
    loadAndGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, username]);

  if (!username) {
    return <div><p>Please log in to see your events.</p></div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const persistAll = (all) => {
    try {
      sessionStorage.setItem("eventsByUser", JSON.stringify(all));
      loadAndGroup();
    } catch (err) {
      console.error("Failed to persist events", err);
      setError("Failed to persist events.");
    }
  };

  const handleDelete = (eventId) => {
    try {
      const raw = sessionStorage.getItem("eventsByUser");
      const all = raw ? JSON.parse(raw) : {};
      const userList = Array.isArray(all[username]) ? all[username] : [];
      const filtered = userList.filter((e) => e.id !== eventId);
      all[username] = filtered;
      persistAll(all);
      if (editingId === eventId) setEditingId(null);
    } catch (err) {
      console.error("Failed to delete event", err);
      setError("Failed to delete event.");
    }
  };

  const startEdit = (evId) => setEditingId(evId);
  const cancelEdit = () => setEditingId(null);

  const saveEdit = (updatedEvent) => {
    if (!updatedEvent || !updatedEvent.id) return;
    try {
      const raw = sessionStorage.getItem("eventsByUser");
      const all = raw ? JSON.parse(raw) : {};
      const userList = Array.isArray(all[username]) ? all[username] : [];
      const idx = userList.findIndex((e) => e.id === updatedEvent.id);
      if (idx === -1) {
        setError("Event not found.");
        return;
      }
      userList[idx] = { ...userList[idx], ...updatedEvent, updatedAt: new Date().toISOString() };
      all[username] = userList;
      persistAll(all);
      cancelEdit();
    } catch (err) {
      console.error("Failed to save edit", err);
      setError("Failed to save changes.");
    }
  };

  return (
    <div>
      <h3>Your events</h3>

      {dates.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        dates.map((dateKey) => (
          <section key={dateKey} style={{ marginBottom: "1rem" }}>
            <h4>{formatDateHeading(dateKey)}</h4>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {grouped[dateKey].map((ev) => {
                const eventHeadingParts = [
                  ev.title || "Untitled",
                  ev.date ? formatDateHeading(ev.date) : "Unscheduled"
                ];
                const heading = `${eventHeadingParts[0]} - ${eventHeadingParts[1]}${ev.time ? `, ${ev.time}` : ""}`;

                return (
                  <li key={ev.id} style={{ marginBottom: "0.75rem", padding: "0.5rem", border: "1px solid #eee", borderRadius: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        {/* Event heading */}
                        <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>{heading}</div>

                        {/* Detail fields */}
                        <div style={{ marginTop: 6 }}>
                          <div><strong>Location:</strong> {ev.location || "—"}</div>
                          <div style={{ marginTop: 6 }}><strong>Description:</strong></div>
                          <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{ev.description || "—"}</div>
                        </div>
                      </div>

                      <div style={{ minWidth: 110, textAlign: "right" }}>
                        <button onClick={() => startEdit(ev.id)} style={{ marginBottom: 6 }}>Edit</button>
                        <div><button onClick={() => handleDelete(ev.id)}>Delete</button></div>
                      </div>
                    </div>

                    {editingId === ev.id && (
                      <div style={{ marginTop: 10 }}>
                        <EventEditForm event={ev} onSave={saveEdit} onCancel={cancelEdit} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}