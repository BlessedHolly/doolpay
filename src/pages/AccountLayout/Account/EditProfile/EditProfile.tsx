import { ErrorMessage, Field, Form, Formik } from "formik";
import { useUpdateEmailMutation } from "../../../../store/apiAccountSlice";
import { changeEmailSchema } from "../../../../validationSchema";
import styles from "./EditProfile.module.scss";

function EditProfile() {
  const [updateEmail, { error }] = useUpdateEmailMutation();
  const errorMessage =
    error && "data" in error
      ? (error.data as { message?: string })?.message || ""
      : "";
  console.log(errorMessage);

  return (
    <div>
      <h1>Profile change coming soon</h1>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={changeEmailSchema}
        onSubmit={async (values, { setSubmitting, setTouched }) => {
          try {
            await updateEmail(values);
          } finally {
            setSubmitting(false);
            setTouched({ email: true }); // Отмечаем поле как затронутое
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => {
          const showServerError =
            !errors.email && touched.email && errorMessage;

          return (
            <Form className={styles.form} noValidate>
              <div className={styles["field-container"]}>
                <label className={styles["text-input"]} htmlFor="email">
                  Change email
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

                {/* Показываем ошибку от сервера только если нет ошибки валидации */}
                {showServerError && (
                  <p className={styles.error}>{errorMessage}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles["registration-btn"]}
              >
                {isSubmitting ? "Processing..." : "Change email"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default EditProfile;
