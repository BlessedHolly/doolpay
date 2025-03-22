import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Layout.module.scss";
import Container from "../components/Container/Container";
import { useSelector } from "react-redux";
import { TStore } from "../store/store";

export default function Layout() {
  const theme = useSelector((store: TStore) => store.theme.theme);

  return (
    <>
      <Header classNameHeader={styles.header} />
      <div
        className={`${styles.content} ${
          theme === "light" ? styles["content-light"] : null
        }`}
      >
        <Container>
          <Outlet />
        </Container>
      </div>
      <Footer />
    </>
  );
}
