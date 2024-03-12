import React, { useContext, useState, useEffect } from "react";
import Modal from "./Modal";
import MapList from "./MapList";
import MapContext from "../store/map-context";

const SearchList = (props) => {
  const mapCtx = useContext(MapContext);
  const [isActive, setIsActive] = useState();
  const [isFavorite, setIsFavorite] = useState(false);

  const addFavoriteHandler = (data) => {
    mapCtx.addList({
      id: data.id,
      name: data.name,
      address: data.address,
      categoryName: data.categoryName,
      phone: data.phone,
      center: data.center,
      activeItem: true,
    });
  };

  return (
    <>
      <Modal openModal={props.openModal} list={props.list}>
        {props.list.map((data) => (
          <MapList
            id={data.id}
            onMoveLocaiton={props.onMoveLocation.bind(null, data)}
            key={data.id}
            center={data.center}
            address={data.address}
            name={data.name}
            phone={data.phone}
            categoryName={data.categoryName}
            toggleHandler={addFavoriteHandler.bind(null, data)}
            favoriteFill={isFavorite ? "#FFF500" : "#ededed"}
          />
        ))}
      </Modal>
    </>
  );
};

export default SearchList;
