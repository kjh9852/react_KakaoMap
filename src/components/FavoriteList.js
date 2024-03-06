import React, { useContext } from "react";
import MapContext from "../store/map-context";
import MapList from "./MapList";
import Modal from "./Modal";

const FavoriteList = (props) => {

    const mapCtx = useContext(MapContext);

    const removeFavoriteHandler = (id) => {
        mapCtx.removeList(id)
    };

  return (
    <Modal anotherOpen={props.anotherOpen} openModal={props.openModal} list={props.list}>
      {props.list.map((data) => (
        <MapList
          id={data.id}
          name={data.name}
          address={data.address}
          categoryName={data.categoryName}
          phone={data.phone}
          toggleHandler={removeFavoriteHandler.bind(null, data.id)}
        />
      ))}
    </Modal>
  );
};

export default FavoriteList;
