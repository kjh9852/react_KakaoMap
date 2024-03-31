import React, { useContext, useState, useEffect } from "react";
import NavigationCard from "../Menu/NavigationCard";
import MapList from "../MapList";
import MapContext from "../../store/map-context";
import styles from "./SearchList.module.css";

const SearchList = (props) => {

  return (
    <>
      <NavigationCard openModal={props.openModal} list={props.list}>
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
        <div className={styles.pageNum}>
          {props.pageNum.map((i) => (
            <span
              className={`${props.current === i ? styles.on : ""}`}
              onClick={() => props.onPageChange(i)}
            >
              {i}
            </span>
          ))}
        </div>
      </NavigationCard>
    </>
  );
};

export default SearchList;
