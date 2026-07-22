import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function Login({ submitUsername }) {
  const navigate = useNavigate();

  // read registered users array (top of component)
  let storedUsers = [];
  try {
    const raw = sessionStorage.getItem("registeredUsers");
    storedUsers = raw ? JSON.parse(raw) : [];
  } catch (err) {
    storedUsers = [];
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return (
    <Formik
      initialValues={{
        identifier: "", // (username or email)
        password: "",
      }}
      validate={(values) => {
        const errors = {};

        const id = values.identifier?.trim() || "";

        if (!id) {
          errors.identifier = "Required.";
        } else {
          // accept either a valid email OR a valid username
          const looksLikeEmail = id.includes("@");
          if (looksLikeEmail) {
            if (!emailRegex.test(id)) {
              errors.identifier = "Invalid email format.";
            }
          }
        }

        if (!values.password || !values.password.trim()) {
          errors.password = "Required.";
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting, resetForm, setFieldError }) => {
        setSubmitting(true);

        const identifier = values.identifier?.trim().toLowerCase(); // username or email input
        const password = values.password || "";

        // find a user by username OR by email (normalized)
        const matchedUser = storedUsers.find((u) => {
          const uname = (u.username || "").trim().toLowerCase();
          const email = (u.email || "").trim().toLowerCase();
          return uname === identifier || email === identifier;
        });

        if (!matchedUser) {
          setFieldError(
            "identifier",
            "No account found with that username or email.",
          );
          setSubmitting(false);
          return;
        }

        // password check (demo-only; do NOT store plain passwords in production)
        if (matchedUser.password !== password) {
          setFieldError("password", "Email/username or password is incorrect.");
          setSubmitting(false);
          return;
        }

        // success
        const displayName = matchedUser.username || matchedUser.name;

        // Call the parent prop which should call AuthContext.login()
        // (AuthProvider will persist the user)
        if (typeof submitUsername === "function") {
          submitUsername(displayName);
        }
        navigate("/", { state: { replace: true } });

        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor="identifier">Username or Email</label>
          <Field
            id="identifier"
            name="identifier"
            placeholder="Username or Email"
          />
          <div style={{ color: "red" }}>
            <ErrorMessage name="identifier" />
          </div>

          <label htmlFor="password">Password</label>
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Password"
          />
          <div style={{ color: "red" }}>
            <ErrorMessage name="password" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
}
