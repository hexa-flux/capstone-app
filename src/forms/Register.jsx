import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function Register({ onRegistered }) {
  // Username rule: letters, numbers, hyphens and underscores only
  const usernameRegex = /^[A-Za-z0-9_-]+$/;

  // Password rule: >=8, uppercase, lowercase, digit, special char, no spaces
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])(?!.*\s).{8,}$/;

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      }}
      validate={(values) => {
        const errors = {};

        if (!values.name || !values.name.trim()) {
          errors.name = "Name is required.";
        }

        if (!values.email || !values.email.trim()) {
          errors.email = "Email is required.";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim())
        ) {
          errors.email = "Invalid email address.";
        }

        if (!values.username || !values.username.trim()) {
          errors.username = "Username is required.";
        } else if (values.username.trim().length > 25) {
          errors.username = "Username must be 25 characters or less.";
        } else if (!usernameRegex.test(values.username.trim())) {
          errors.username =
            "Username may contain only letters, numbers, hyphens and underscores.";
        }

        // Password: required + regex
        if (!values.password) {
          errors.password = "Password is required";
        } else if (!passwordRegex.test(values.password)) {
          errors.password =
            "Password must be at least 8 characters, include uppercase, lowercase, a number, a special character, and contain no spaces";
        }

        // Confirm password: must match
        if (!values.confirmPassword) {
          errors.confirmPassword = "Confirm password is required";
        } else if (values.password !== values.confirmPassword) {
          errors.confirmPassword = "Passwords must match";
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting, resetForm, setFieldError }) => {
        setSubmitting(true);

        // PLEASE NOTE: Session storage is only being used to save accounts for demonstration

        const payload = {
          name: values.name?.trim(),
          email: values.email?.trim(),
          username: values.username?.trim(),
          password: values.password,
        };

        // The following allows for multiple users to be registered
        // read existing users (or start with empty array)
        const raw = sessionStorage.getItem("registeredUsers");
        const users = raw ? JSON.parse(raw) : [];

        // check for duplicate email
        const emailExists = users.some(
          (u) => (u.email || "").toLowerCase() === payload.email.toLowerCase(),
        );

        if (emailExists) {
          // show validation error for the email field and stop submission
          setFieldError("email", "An account with this email already exists.");
          setSubmitting(false);
          return;
        }

        // Check duplicate username
        const newUname = payload.username?.toLowerCase();
        const usernameExists = users.some(
          (u) => (u.username || "").trim().toLowerCase() === newUname,
        );

        if (usernameExists) {
          // mark touched so ErrorMessage shows immediately
          setFieldTouched("username", true);
          setFieldError("username", "This username is already taken.");
          setSubmitting(false);
          return;
        }

        // append and save back
        users.push(payload);
        sessionStorage.setItem("registeredUsers", JSON.stringify(users));

        // Parent functions are passed here
        if (typeof onRegistered === "function") {
          onRegistered(payload);
        }

        setSubmitting(false);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor="name">Name</label>
          <Field id="name" name="name" placeholder="Name" />
          <ErrorMessage name="name" component="div" />

          <label htmlFor="email">Email</label>
          <Field id="email" name="email" placeholder="Email" type="email" />
          <ErrorMessage name="email" component="div" />

          <label htmlFor="username">Username</label>
          <Field id="username" name="username" placeholder="Username" />
          <ErrorMessage name="username" component="div" />

          <label htmlFor="password">Password</label>
          <Field
            id="password"
            name="password"
            placeholder="Password"
            type="password"
          />
          <ErrorMessage name="password" component="div" />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <Field
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            type="password"
          />
          <ErrorMessage name="confirmPassword" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
}
