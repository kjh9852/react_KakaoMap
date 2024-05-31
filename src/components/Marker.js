import React from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styles from "./Marker.module.css";

const Marker = ({
  onMarkersHandler,
  onMouseOut,
  onTouchStart,
  data,
  image,
  isOpen,
  name,
  saveName,
}) => {
  console.log(data);
  return (
    <>
      <MapMarker
        className={styles.markerInfo}
        onMouseOver={onMarkersHandler && onMarkersHandler}
        onTouchStart={onTouchStart && onTouchStart}
        onMouseOut={onMouseOut && onMouseOut}
        position={data && data.position}
        image={image && image}
      />
      {isOpen && name && saveName === data.name && (
        <CustomOverlayMap position={data.position} yAnchor={2}>
          <div className={styles.markerInfo}>
            <p>{data.name ? data.name : data.address}</p>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
};

export default Marker;
