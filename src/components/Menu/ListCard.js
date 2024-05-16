import styles from "./ListCard.module.css";

const ListCard = ({isOpen, children }) => {

  return (
    <div className={`${styles.container}`}>
      <div
        className={`${styles.tabBar} ${isOpen ? styles.open : ""}`}
      ></div>
      <div
        id="listSection"
        className={`${styles.layout} ${isOpen ? styles.open : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ListCard;
