import React, { useReducer } from "react";

const MapContext = React.createContext({
  lists: [],
  addList: (list) => {},
  removeList: (id) => {},
});

const defaultState = {
  lists: [],
};

const listReducer = (state, action) => {
  let updatedLists;
  if (action.type === "ADD") {
    const existingListIndex = state.lists.findIndex(
      (list) => list.id === action.list.id
    ); // id 값이 같으면 맞는 인덱스 반환 아니면 -1 (action은 현재 누른 값)
    const existingListData = state.lists[existingListIndex];
    // lists에 인덱스 값 삽입
    if(existingListData) { // 중복된 인덱스 일 떄
        updatedLists = [...state.lists];
    } else {
        updatedLists = state.lists.concat(action.list);
        // lists 배열에 현재 누른 데이터 삽입
    }

    return {
      lists: updatedLists,
    };
  }
  if (action.type === "REMOVE") {
    updatedLists = state.lists.filter((list) => list.id !== action.id);
    return {
      lists: updatedLists,
    };
  }
};

export const MapContextProvider = (props) => {
  const [listState, dispatchListAction] = useReducer(listReducer, defaultState);

  const addListHandler = (list) => {
    dispatchListAction({ type: "ADD", list: list });
  };

  const removeListHandler = (id) => {
    dispatchListAction({ type: "REMOVE", id: id });
  };

  const listContext = {
    lists: listState.lists,
    addList: addListHandler,
    removeList: removeListHandler,
  };

  return (
    <MapContext.Provider value={listContext}>
      {props.children}
    </MapContext.Provider>
  );
};

export default MapContext;
