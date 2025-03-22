import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./Registration.module.scss";
import { useEffect, useState } from "react";
import { useRegistrationProfileMutation } from "./../../store/apiAccountSlice";
import { registrationSchema } from "../../validationSchema";
// 1A!aaaaa

function Registration() {
  const [showPassword, setShowPassword] = useState(false);

  const [registrationProfile, { data, error }] =
    useRegistrationProfileMutation(undefined);
  const errorMessage =
    error && "data" in error
      ? (error.data as { message?: string })?.message || "Registration error"
      : "Registration error";

  const {
    state: { from },
  } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.userId) {
      document.cookie = `userId=${data.userId}; path=/;`;
      navigate(from || "/", { replace: true });
      location.reload();
    }
  }, [from, data, navigate]);

  return (
    <div className={styles["registration-container"]}>
      <div>
        <h1 className={styles["register-title"]}>Oops😕</h1>
        <h2>You are not registered</h2>
        <p>Register please:</p>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={registrationSchema}
          onSubmit={(values) => registrationProfile(values)}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form} noValidate>
              <div className={styles["field-container"]}>
                <label className={styles["text-input"]} htmlFor="name">
                  Name
                </label>
                <Field
                  name="name"
                  className={styles["field"]}
                  id="name"
                  type="text"
                  placeholder=""
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles["field-container"]}>
                <label className={styles["text-input"]} htmlFor="email">
                  Email
                </label>
                <Field
                  name="email"
                  className={styles["field"]}
                  id="email"
                  type="email"
                  placeholder=""
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div
                className={`${styles["field-container"]} ${styles["field-container-password"]}`}
              >
                <label className={styles["text-input"]} htmlFor="password">
                  Password
                </label>
                <Field
                  name="password"
                  className={styles["field"]}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
                <div className={styles["hide-show-password"]}>
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={styles["hide-show-password-button"]}
                    type="button"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        color="white"
                      >
                        <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-11-8-11-8a18.71 18.71 0 0 1 3.08-4.62M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12" />
                        <path d="M10.73 5.08A10.05 10.05 0 0 1 12 4c7 0 11 8 11 8a18.78 18.78 0 0 1-1.69 2.58M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        color="white"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles["registration-btn"]}
              >
                {isSubmitting ? "Processing..." : "Registration"}
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles["other-action"]}>
          <p>Already have an account?</p>
          <Link to={"/login"} state={{ from }}>
            Login.
          </Link>
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {errorMessage ? errorMessage : "Registration error"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Registration;
