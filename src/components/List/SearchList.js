import React, { useState, useEffect ,useRef } from "react";
import ListCard from "../Menu/ListCard";
import MapList from "../MapList";
import MapContext from "../../store/map-context";
import styles from "./SearchList.module.css";

const SearchList = (props) => {
  const activePageNum = props.current;

  const list = props.list;

  if(list.length && list[0].type === "ROAD") {
    list.sort((a,b) => {
      return a.roadData > b.roadData ? 1 : -1
    })
  }

  useEffect(() => {
    document.getElementById('listSection').scrollTo(0,0);
  },[activePageNum])
  
  return (
    <ListCard scroll={props.scroll} openLayout={props.openList}>
      {list.map((data) => (
        <MapList
          id={data.id}
          type={data.type ? data.type : ""}
          onMoveLocaiton={props.onMoveLocation.bind(null, data)}
          key={data.id}
          center={data.center}
          roadData={data.roadData}
          address={data.address}
          name={data.name}
          phone={data.phone}
          category={data.categoryName}
          toggleHandler={props.addFavoriteHandler.bind(null, data)}
          favoriteFill={data.favorite ? "#FFF500" : "#ededed"}
          location={props.location}
        />
      ))}
      <div className={styles.pageNum}>
        {props.pageNum.map((i) => (
          <span
            className={`${props.current === i ? styles.on : ""}`}
            onClick={props.onPageChange.bind(null, i)}
          >
            {i}
          </span>
        ))}
      </div>
    </ListCard>
  );
};

export default SearchList;
