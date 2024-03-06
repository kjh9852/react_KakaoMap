import { useState } from "react";
import MapList from "./MapList";
import styles from "./Modal.module.css";

const Modal = (props) => {
  const [touchPosition, setTouchPosition] = useState();

  const touchHandler = (e) => {
    setTouchPosition(e.changedTouches[0].pageY);
  };

  return (
    <>
      {!props.anotherOpen && props.list.length >= 1 && (
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
            zIndex: "2",
          }}
        >
          <div className={styles.tabBar}></div>
          <div
            style={{
              ...(props.openModal && props.list.length >= 1
                ? { marginTop: "1rem", maxHeight: "20rem" }
                : { marginTop: "0", maxHeight: "0" }),
              height: "auto",
              overflow: "hidden",
              overflowY: "scroll",
              transition: "all 0.5s ease",
            }}
          >
            {props.children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
