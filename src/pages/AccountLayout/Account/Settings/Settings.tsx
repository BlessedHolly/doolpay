import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../../store/themeSlice";
import styles from "./Settings.module.scss";
import { TStore } from "../../../../store/store";
import {
  useDeleteAccountMutation,
  useLogoutProfileMutation,
} from "../../../../store/apiAccountSlice";
import { useNavigate } from "react-router-dom";

function Settings() {
  const theme = useSelector((store: TStore) => store.theme.theme);
  const dispatch = useDispatch();
  const [logoutProfile] = useLogoutProfileMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const navigate = useNavigate();

  return (
    <div className={styles.settingsContainer}>
      <h1>Settings</h1>
      <div>
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`${styles.button} ${
            theme === "light" ? styles["button-light"] : null
          }`}
        >
          {theme === "dark" ? "Dark" : "Light"}
        </button>
        <span className={`${styles["span"]}`}>Change theme</span>
      </div>
      <div>
        <button
          className={`${styles.button} ${
            theme === "light" ? styles["button-light"] : null
          }`}
          onClick={() => {
            logoutProfile(undefined);
            navigate("/", { replace: true });
            location.reload();
          }}
        >
          Leave
        </button>
        <span className={styles["span"]}>Leave account</span>
      </div>
      <div>
        <button
          className={`${styles.button} ${
            theme === "light" ? styles["button-light"] : null
          }`}
          onClick={() => {
            deleteAccount(undefined).then(() => {
              logoutProfile(undefined);
              navigate("/", { replace: true });
              location.reload();
            });
          }}
        >
          Delete
        </button>
        <span className={styles["span"]}>Delete account</span>
      </div>
    </div>
  );
}

export default Settings;
