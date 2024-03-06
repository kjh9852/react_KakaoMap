import React,{useContext} from 'react';
import Modal from "./Modal";
import MapList from "./MapList";
import MapContext from '../store/map-context';

const SearchList = (props) => {
    const mapCtx = useContext(MapContext);

    const addFavoriteHandler = (data) => {
        mapCtx.addList({
            id:data.id,
            name: data.name,
            address: data.address,
            categoryName: data.categoryName,
            phone: data.phone
        })
    };

  return (
    <Modal anotherOpen={props.anotherOpen} openModal={props.openModal} list={props.list}>
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
          toggleHandler={addFavoriteHandler.bind(null, data)}
        />
      ))}
    </Modal>
  );
};

export default SearchList;
