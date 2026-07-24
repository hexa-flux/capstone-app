import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import "./formStyling.css";

/**
 * Props:
 * - username: string (current user)
 * - onSubmit: function(newEvent) -> parent handles persistence
 * - initialValues?: optional object for editing
 */
export default function EventForm({ username, onSubmit, initialValues }) {
  const defaults = {
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaults}
      validate={(values) => {
        const errors = {};
        if (!values.title || !values.title.trim())
          errors.title = "Event name is required.";
        if (!values.date) errors.date = "Date is required.";
        if (!values.time) errors.time = "Time is required.";
        if (!values.location || !values.location.trim())
          errors.location = "Location is required.";
        return errors;
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        const newEvent = {
          id: `${username}-${Date.now()}`,
          title: values.title.trim(),
          date: values.date,
          time: values.time,
          location: values.location.trim(),
          description: values.description.trim(),
          owner: username,
          createdAt: new Date().toISOString(),
        };

        try {
          if (typeof onSubmit === "function") onSubmit(newEvent);
          resetForm();
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="eventFormGrid">
          <div className="field">
            <label htmlFor="title">Event name</label>
            <Field id="title" name="title" placeholder="Event name" />
            <div style={{ color: "red" }}>
              <ErrorMessage name="title" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <Field id="date" name="date" type="date" />
            <div style={{ color: "red" }}>
              <ErrorMessage name="date" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="time">Time</label>
            <Field id="time" name="time" type="time" />
            <div style={{ color: "red" }}>
              <ErrorMessage name="time" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <Field id="location" name="location" placeholder="Location" />
            <div style={{ color: "red" }}>
              <ErrorMessage name="location" />
            </div>
          </div>

          <div className="field description">
            <label htmlFor="description">Description</label>
            <Field
              id="description"
              name="description"
              as="textarea"
              placeholder="Describe the event"
            />
          </div>

          <div className="field actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Event"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
