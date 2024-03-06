import React, { useContext } from "react";
import MapContext from "../store/map-context";
import MapList from "./MapList";
import Modal from "./Modal";

const FavoriteList = (props) => {

  return (
    <Modal openModal={props.openModal} list={props.list}>
      {props.list.map((data) => (
        <MapList
          id={data.id}
          name={data.name}
          address={data.address}
          categoryName={data.categoryName}
          phone={data.phone}
        />
      ))}
    </Modal>
  );
};

export default FavoriteList;
