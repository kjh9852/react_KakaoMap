import React, { useContext, useState } from "react";
import Modal from "./Modal";
import MapList from "./MapList";
import MapContext from "../store/map-context";

const SearchList = (props) => {
  const mapCtx = useContext(MapContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isActive, setIsActive] = useState();

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

    setIsActive(() => {
      return data.id;
    })

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
            activeFavorite={data.id === isActive  ? "#222222" : "#999999"}
          />
        ))}
      </Modal>
    </>
  );
};

export default SearchList;
