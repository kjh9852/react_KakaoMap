import { useState } from "react";
import MapList from "../MapList";
import styles from "./NavigationCard.module.css";

const NavigationCard = (props) => {
  return (
    <>
        <div
          style={{
            background: "#ffffff",
            width: "100%",
            minHeight: "24px",
            height: "auto",
            overflow: "hidden",
            position: "fixed",
            bottom: "56px",
            borderRadius: "10px 10px 0 0",
            borderBottom: "1px solid #ededed",
            transition: "all 1s ease",
            ...(props.openModal ? {zIndex: '20'} : {zIndex: '1'}),
          }}
        >
          <div className={styles.tabBar}></div>
          <div
            style={{
              ...(props.openModal
                ? { marginTop: "1.5rem", maxHeight: "20rem" }
                : { marginTop: "0", maxHeight: "0" }),
              padding: "0.75rem",
              height: "auto",
              overflow: "hidden",
              overflowY: "scroll",
              transition: "all 0.5s ease",
            }}
          >
            {props.children}
          </div>
        </div>
    </>
  );
};

export default NavigationCard;
