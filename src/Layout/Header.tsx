import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";
import Container from "../components/Container/Container";
import { useSelector } from "react-redux";
import { TStore } from "../store/store";

export default function Header({
  classNameHeader,
}: {
  classNameHeader: string;
}) {
  const theme = useSelector((state: TStore) => state.theme.theme);

  return (
    <header className={`${theme === "light" ? styles["header-light"] : null}`}>
      <Container>
        <div className={`${classNameHeader} ${styles.head}`}>
          <p
            className={`${styles.name} ${
              theme === "light" ? styles["name-light"] : null
            }`}
          >
            Doolpay
          </p>
          <nav className={styles.navigation}>
            <NavLink
              className={({ isActive }) =>
                theme === "light"
                  ? isActive
                    ? styles["active-link-light"]
                    : styles["link-light"]
                  : isActive
                  ? "active"
                  : ""
              }
              to={"/"}
            >
              Coins
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                theme === "light"
                  ? isActive
                    ? styles["active-link-light"]
                    : styles["link-light"]
                  : isActive
                  ? "active"
                  : ""
              }
              end
              to={"/Account"}
            >
              Account
            </NavLink>
          </nav>
        </div>
      </Container>
    </header>
  );
}
