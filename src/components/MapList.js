import React, {useContext} from 'react';
import MapContext from '../store/map-context';
import styles from './MapList.module.css'

const MapList = (props) => {
    const mapCtx = useContext(MapContext);
    const addFavoriteHandler = () => {
        mapCtx.addList({
            id:props.id,
            name: props.name,
            address: props.address,
            categoryName: props.categoryName,
            phone: props.phone
        })
    };

    return (
        <div onClick={props.onMoveLocaiton} style={{padding: '0.75rem 0'}}>
            <h3 key={props.id} >{props.name}</h3>
            <address>{props.address}</address>
            <p>{props.phone}</p>
            <p>{props.categoryName}</p>
            <div>
                <button onClick={props.toggleHandler}>Favorite</button>
            </div>
        </div>
    )
};

export default MapList;