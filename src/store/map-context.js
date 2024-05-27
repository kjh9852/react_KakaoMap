import React, { useReducer, useState } from "react";

const MapContext = React.createContext({
  lists: [],
  sort : null,
  addList: () => {},
  removeList: (id) => {},
  sortChange: () => {},
});

const defaultState = {
  lists: [],
};

const listReducer = (state, action) => {
  let updatedLists;

  if (action.type === "ADD") {
    const existingListIndex = state.lists.findIndex(
      (list) => list.id === action.payload.id
    ); // id 값이 같으면 맞는 인덱스 반환 아니면 -1 (action은 현재 누른 값)
    const existingListData = state.lists[existingListIndex];
    // lists에 인덱스 값 삽입
    if(existingListData) { // 중복된 인덱스 일 떄
        updatedLists = [...state.lists];
    } else {
        updatedLists = state.lists.concat(action.payload);
        // lists 배열에 현재 누른 데이터 삽입
    }
    return {
      ...state.lists,
      lists: updatedLists,
    };
  }

  if (action.type === "REMOVE") {
    updatedLists = state.lists.filter((list) => list.id !== action.payload);
    return {
      ...state.lists,
      lists: updatedLists,
    };
  }
};

export const MapContextProvider = (props) => {
  const [listState, dispatchListAction] = useReducer(listReducer, defaultState);
  const [sortType, setSortType] = useState('default');

  const sortChangeHandler = (type) => {
    setSortType(type);
  };

  const addListHandler = (list) => {
    dispatchListAction({ type: "ADD", payload: list });
  };

  const removeListHandler = (id) => {
    dispatchListAction({ type: "REMOVE", payload: id });
  };

  const listContext = {
    lists: listState.lists,
    sort: sortType,
    addList: addListHandler,
    removeList: removeListHandler,
    sortChange: sortChangeHandler,
  };

  return (
    <MapContext.Provider value={listContext}>
      {props.children}
    </MapContext.Provider>
  );
};

export default MapContext;
