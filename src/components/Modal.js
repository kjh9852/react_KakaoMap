import MapList from "./MapList";
import styles from './Modal.module.css';

const Modal = (props) => {
  return (
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        minHeight: "24px",
        overflow: "hidden",
        position: "absolute",
        bottom: "56px",
        borderRadius: "10px 10px 0 0",
        borderBottom: "1px solid #ededed",
        zIndex: "1",
      }}
    >
      <div className={styles.tabBar}></div>
      <div  
        style={{
          ...props.info.length > 1 ? {marginTop: '1rem'} : {marginTop: 'none'},
          minHeight: "24px",
          maxHeight: "20rem",
          overflow: "hidden",
          overflowY: "scroll",
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
