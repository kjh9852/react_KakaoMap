import React, {useEffect, useContext} from "react";
import MapContext from "../../store/map-context";
import MapList from "../MapList";
import SortButton from "../UI/SortButton";
import styles from "./SearchList.module.css";

const SearchList = ({
  list,
  current,
  pageNum,
  addFavoriteHandler,
  onMoveLocation,
  onPageChange,
}) => {
  if (list.length && list[0].type === "ROAD") {
    list.sort((a, b) => {
      return a.roadData > b.roadData ? 1 : -1;
    });
  }
  const {sortChange} = useContext(MapContext);

  const handleSortChange = (type) => {
    sortChange(type);
  };

  const selectFavoirteList = JSON.stringify(
    list.map(({ favorite, ...rest }) => rest)
  );

  useEffect(() => {
    const listSetion = document.getElementById("listSection");
    listSetion.scrollTo(0, 0);
  }, [current, selectFavoirteList]);

  return (
    <>
    <div className={styles.sortAction}>
      <SortButton onSortChange={handleSortChange} sortType="ACCURACY" btnName="정확도순" />
      <SortButton onSortChange={handleSortChange} sortType="DISTANCE" btnName="거리순" />
    </div>
      {list.map((data) => (
        <MapList
          key={
            data.id ? `list-${data.id}` : `road-${data.address + data.roadData}`
          }
          id={data.id}
          type={data.type ? data.type : ""}
          onMoveLocaiton={onMoveLocation.bind(null, data)}
          center={data.center}
          roadData={data.roadData}
          address={data.address}
          name={data.name}
          phone={data.phone}
          category={data.categoryName}
          toggleHandler={addFavoriteHandler.bind(null, data)}
          favoriteFill={data.favorite ? "#FFF500" : "#ededed"}
        />
      ))}
      <div className={styles.pageNum}>
        {pageNum.map((i) => (
          <span
            className={`${current === i ? styles.on : ""}`}
            onClick={onPageChange.bind(null, i)}
          >
            {i}
          </span>
        ))}
      </div>
    </>
  );
};

export default SearchList;
