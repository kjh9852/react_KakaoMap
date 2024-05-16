import {useState,useEffect, useContext, useRef } from "react";

import SearchList from "./SearchList";
import FavoriteList from "./FavoriteList";
import ListCard from "../Menu/ListCard";
import CategoryList from "./CategoryList";
import MapContext from "../../store/map-context";

export default function ListContainer({
  listState,
  onCategory,
  resetMarker,
  resetList,
  list,
  onMoveLocation,
  addFavoriteHandler,
  removeFavoriteHandler,
  pageNum,
  onPageChange,
  current,
}) {

  let isOpen = false;

  const [ListComponent, setListComponent] = useState(null);
  const [openState, setOpenState] = useState(isOpen);
  const mapCtx = useContext(MapContext);
  const listRef = useRef();

  useEffect(() => {
    if (listState.listOpen) {
      setOpenState(listState.listOpen);
      setListComponent(
        <SearchList
          list={list}
          onMoveLocation={onMoveLocation}
          addFavoriteHandler={addFavoriteHandler}
          pageNum={pageNum}
          onPageChange={onPageChange}
          current={current}
        />
      );
    } else if (listState.favoriteOpen && mapCtx.lists.length > 0) {
      setOpenState(listState.favoriteOpen);
      setListComponent(
        <FavoriteList
          list={mapCtx.lists}
          onMoveLocation={onMoveLocation}
          removeFavoriteHandler={removeFavoriteHandler}
        />
      );
    } else if (listState.categoryOpen) {
      setOpenState(listState.categoryOpen);
      setListComponent(
        <CategoryList
          onCategory={onCategory}
          resetMarker={resetMarker}
          resetList={resetList}
        />
      );
    } else {
      setOpenState(false);
      listRef.current = setTimeout(() => {
        setListComponent(null)
      },[500])
    }
    return () => {
      clearTimeout(listRef.current);
    }
  },[listState, list, mapCtx.lists])
 
  return (
    <ListCard isOpen={openState}>
      {ListComponent}
    </ListCard>
  );
}
