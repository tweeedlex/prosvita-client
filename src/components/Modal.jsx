import React, { useEffect } from "react";
import styles from "./css/Modal.module.css";

export const Modal = ({ children, visible, setVisible, isBasket, zIndex, isOrder }) => {
  let body = document.querySelector("body");

  useEffect(() => {
    if (!isOrder) {
      if (visible) {
        body.classList = "lock";
      } else {
        body.classList = "";
      }
    }
  }, [visible]);

  return (
    <div
      style={{
        zIndex: zIndex ? zIndex : "unset",
        display: visible ? "flex" : "none",
      }}
      onClick={() => setVisible(false)}
      className={styles.modal}
    >
      <div
        style={{ zIndex: zIndex ? zIndex + 1 : "unset" }}
        onClick={(e) => e.stopPropagation()}
        className={styles.form + ` ${isBasket && " " + styles.basket}`}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
