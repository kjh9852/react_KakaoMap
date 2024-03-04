import styles from './MapList.module.css'

const MapList = (props) => {
    return (
        <div onClick={props.onMoveLocaiton} style={{padding: '0.75rem 0'}}>
            <h3 key={props.id} >{props.name}</h3>
            <address>{props.address}</address>
            <p>{props.phone}</p>
            <p>{props.categoryName}</p>
        </div>
    )
};

export default MapList;