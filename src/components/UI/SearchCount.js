import styles from './SearchCount.module.css'

const SearchCount = (props) => {
    return (
        <div className={`${styles.container} ${props.fade}`}>
            <div className={styles.card}>
                {props.message}
            </div>
        </div>
    )
};

export default SearchCount;