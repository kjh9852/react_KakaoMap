import React, {useReducer} from "react";

const MapContext = React.createContext({
    lists: [],
    addList: (list) => {},
    removeList: (id) => {},
});

const defaultState = {
    lists: [],
}

const listReducer = (state,action) => {
    let updatedList;
    if(action.type === 'ADD') {
        updatedList = state.lists.concat(action.list)
        return {
            lists: updatedList
        }
    }
    if(action.type === 'REMOVE') {
        updatedList = state.lists.filter(list => list.id !== action.id);
        return {
            lists: updatedList
        }
    }
};

export const MapContextProvider = (props) => {
    const [listState, dispatchListAction] = useReducer(
        listReducer,
        defaultState
    );

    const addListHandler = (list) => {
        dispatchListAction({type: 'ADD', list: list})
    };

    const removeListHandler = (id) => {
        dispatchListAction({type: "REMOVE", id: id})
    };

    const listContext = {
        lists: listState.lists,
        addList: addListHandler,
        removeList: removeListHandler,
    };

    return(
        <MapContext.Provider value={listContext}>
            {props.children}
        </MapContext.Provider>
    )
};

export default MapContext;