import Container from "../components/Container/Container";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <p className={styles.footerParagraph}>Footer</p>
      </Container>
    </footer>
  );
}
