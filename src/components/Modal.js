import MapList from "./MapList";

const Modal = (props) => {
  return (
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        minHeight: "24px",
        overflow: "hidden",
        position: "absolute",
        padding: "24px 0",
        bottom: "56px",
        borderRadius: "10px 10px 0 0",
        borderBottom: "1px solid #ededed",
        zIndex: "1",
      }}
    >
      <div
        style={{
          background: "#d9d9d9",
          width: "40px",
          height: "3px",
          borderRadius: "10px",
          position: "absolute",
          top: "8px",
          left: "50%",
          translate: '-50%',
        }}
      ></div>
      <div
        style={{
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
