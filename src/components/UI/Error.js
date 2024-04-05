import React from "react";
import styles from "./Error.module.css";

const Modal = (props) => {
  return (
    <div onClick={props.onCancel} className={styles.backdrop}>
      <div className={styles.container}>
        <div className={styles.card}>
          <p>{props.message}</p>
          <button onClick={props.onCancel}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
