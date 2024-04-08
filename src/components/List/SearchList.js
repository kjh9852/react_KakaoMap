import React, { useContext, useState, useEffect } from "react";
import NavigationCard from "../Menu/NavigationCard";
import MapList from "../MapList";
import MapContext from "../../store/map-context";
import styles from "./SearchList.module.css";

const SearchList = (props) => {
  const list = props.list;
  
  if(list.length && list[0].type === "ROAD") {
    list.sort((a,b) => {
      if(a.roadData === b.roadData) {
        return a.address > b.address ? 1 : -1
      }
      return a.roadData > b.roadData ? 1 : -1
    })
  }

  return (
      <NavigationCard openModal={props.openModal} list={props.list}>
        {list.map((data) => (
          <MapList
            id={data.id}
            type={data.type ? data.type : ''}
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
              onClick={() => props.onPageChange(i)}
            >
              {i}
            </span>
          ))}
        </div>
      </NavigationCard>
  );
};

export default SearchList;
