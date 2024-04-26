import React from 'react';
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styles from './Marker.module.css'

const Marker = (props) => {
  return (
    <>
      <MapMarker
        className={styles.markerInfo}
        onMouseOver={props.onMarkersHandler}
        onTouchStart={props.onTouchStart}
        onMouseOut={props.onMouseOut}
        position={props.data.position}
        image={props.image}
      />
      {props.isOpen && props.name && props.saveName === props.data.name && (
        <CustomOverlayMap position={props.data.infoPosistion} yAnchor={2}>
          <div className={styles.markerInfo}>
            <p>{props.data.name ? props.data.name : props.data.address}</p>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
};

export default Marker;
