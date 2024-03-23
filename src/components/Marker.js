import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styles from './Marker.module.css'

const Marker = (props) => {
  return (
    <>
      <MapMarker
        className={styles.markerInfo}
        onMouseOver={props.onMarkersHandler}
        onMouseOut={props.onMouseOut}
        position={props.position}
        image={props.image}
      />
      {props.isOpen && props.name && props.saveName === props.inSertName && (
        <CustomOverlayMap position={props.infoPosistion} yAnchor={2}>
          <div className={styles.markerInfo}>
            <p>{props.inSertName ? props.inSertName : props.address}</p>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
};

export default Marker;
