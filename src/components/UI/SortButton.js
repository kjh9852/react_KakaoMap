import { useContext } from "react";
import MapContext from "../../store/map-context";
import styles from "./SortButton.module.css";

export default function SortButton({ onSortChange, btnName, sortType }) {
  const { sort } = useContext(MapContext);

  const handleCheck = () => {
    onSortChange(sortType);
  };
  console.log(sortType);
  return (
    <>
      <button
        onClick={handleCheck}
        className={`${styles.btn} ${sortType === sort ? styles.active : ""}`}
        sortType={sortType}
      >
        {btnName}
      </button>
    </>
  );
}
