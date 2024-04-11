import { useState, useRef, useEffect } from "react";
import MapList from "../MapList";
import styles from "./ListCard.module.css";

const ListCard = (props) => {

  return (
    <div
      className={`${styles.container} ${props.openLayout ? styles.open : ""}`}
    >
      <div className={styles.tabBar}></div>
      <div id='listSection' className={styles.layout}>
        {props.children}
      </div>
    </div>
  );
};

export default ListCard;
