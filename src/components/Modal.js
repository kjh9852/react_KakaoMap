import { useState } from "react";
import MapList from "./MapList";
import styles from './Modal.module.css';

const Modal = (props) => {
  const [touchPosition, setTouchPosition] = useState();
  const touchHandler = (e) => {
    setTouchPosition(e.changedTouches[0].pageY);
  };
  console.log(touchPosition);
  return (
    <div
      onTouchMove={touchHandler}
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
        transition: 'all 1s ease',
        zIndex: "2",
      }}
    >
      <div className={styles.tabBar}></div>
      <div
        style={{
          ...props.openModal && props.info.length > 1 ? {marginTop: '1rem', maxHeight: '20rem'} : {marginTop: '0',maxHeight: '0rem'},
          height: touchPosition,
          overflow: "hidden",
          overflowY: "scroll",
          transition: "all 0.5s ease"
        }}
      >
        {props.info.map((data) => (
          <MapList
            onMoveLocaiton={props.onMoveLocation.bind(null, data)}
            key={data.id}
            center={data.center}
            address={data.address}
            name={data.name}
            phone={data.phone}
            categoryName={data.categoryName}
          />
        ))}
      </div>
    </div>
  );
};

export default Modal;
