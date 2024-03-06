import Modal from "./Modal";
import MapList from "./MapList";

const SearchList = (props) => {
  return (
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
        />
      ))}
    </Modal>
  );
};

export default SearchList;
