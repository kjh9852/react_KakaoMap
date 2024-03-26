import React, { useContext } from "react";
import MapContext from "../store/map-context";
import MapList from "./MapList";
import Modal from "./Modal";

const FavoriteList = (props) => {
  const mapCtx = useContext(MapContext);

  return (
    <>
      {!props.openMenu && (
        <Modal openModal={props.openModal} list={props.list}>
          {props.list.map((data) => (
            <MapList
              id={data.id}
              onMoveLocaiton={() => props.onMoveLocation.bind(null, data)}
              ket={data.id}
              center={data.center}
              name={data.name}
              address={data.address}
              categoryName={data.categoryName}
              phone={data.phone}
              toggleHandler={props.removeFavoriteHandler.bind(null, data)}
              favoriteFill="#FFF500"
            />
          ))}
        </Modal>
      )}
    </>
  );
};

export default FavoriteList;
