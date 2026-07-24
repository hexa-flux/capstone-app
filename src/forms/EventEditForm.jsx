import React from "react";
import { useState } from "react";

import "./formStyling.css";

/**
 * Props:
 * - event: { id, title, date, time, location, description, owner, ... }
 * - onSave(updatedEvent): function
 * - onCancel(): function
 */
export default function EventEditForm({ event, onSave, onCancel }) {
  const [title, setTitle] = useState(event.title || "");
  const [date, setDate] = useState(event.date || "");
  const [time, setTime] = useState(event.time || "");
  const [location, setLocation] = useState(event.location || "");
  const [description, setDescription] = useState(event.description || "");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const updated = {
      ...event,
      title: title.trim(),
      date,
      time,
      location: location.trim(),
      description: description.trim(),
      updatedAt: new Date().toISOString(),
    };
    if (typeof onSave === "function") onSave(updated);
  }

  return (
    <form onSubmit={handleSubmit} className="editingForm">
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        <label>
          Title:{" "}
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Date:{" "}
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Time:{" "}
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Location:{" "}
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Description:{" "}
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Save</button>{" "}
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}