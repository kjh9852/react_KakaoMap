import { useState } from "react";
import MapList from "../MapList";
import styles from "./NavigationCard.module.css";

const NavigationCard = (props) => {
  return (
    <>
        <div className={`${styles.container} ${props.openModal ? styles.open : ''}`}>
          <div className={styles.tabBar}></div>
          <div className={styles.layout}>
            {props.children}
          </div>
        </div>
    </>
  );
};

export default NavigationCard;
