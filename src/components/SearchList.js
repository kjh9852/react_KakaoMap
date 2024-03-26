import React, { useContext, useState, useEffect } from "react";
import Modal from "./Modal";
import MapList from "./MapList";
import MapContext from "../store/map-context";

const SearchList = (props) => {
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
            toggleHandler={props.addFavoriteHandler.bind(null, data)}
            favoriteFill={data.favorite ? "#FFF500" : "#ededed"}
          />
        ))}
        {props.pageNum.map((i) => <span onClick={() => props.onPageChange(i)}>{i}</span>)}
      </Modal>
    </>
  );
};

export default SearchList;
