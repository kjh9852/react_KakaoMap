import React from "react";
import MapList from "../MapList";

const FavoriteList = ({
  list,
  onMoveLocation,
  removeFavoriteHandler,
}) => {
  return (
    <>
      {list.map((data) => (
        <MapList
          id={data.id}
          onMoveLocaiton={onMoveLocation.bind(null, data)}
          ket={data.id}
          center={data.center}
          name={data.name}
          address={data.address}
          category={data.categoryName}
          phone={data.phone}
          toggleHandler={removeFavoriteHandler.bind(null, data)}
          favoriteFill="#FFF500"
        />
      ))}
    </>
  );
};

export default FavoriteList;
