import React from "react";
import styles from "./Container.module.scss";

interface IContainerProps {
  children: React.ReactNode;
}

function Container({ children }: IContainerProps) {
  return <div className={styles.container}>{children}</div>;
}

export default Container;
