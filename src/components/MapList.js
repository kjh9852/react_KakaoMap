import React from "react";
import styles from "./MapList.module.css";
import kmIcon from "../images/km_icon.png";

const MapList = (props) => {

  let listCategory;
  let category = props.category;

  const changeCategory = () => {
    const split = category.split(">");
    if (split.length >= 4) {
      return (listCategory = category
        .split(">")
        .slice(2, 4)
        .join("\u00a0>\u00a0"));
    } else
      return (listCategory = category
        .split(">")
        .slice(1, 3)
        .join("\u00a0>\u00a0"));
  };

  if (props.category) changeCategory();

  return (
    <div
      onClick={props.onMoveLocaiton}
      className={styles.container}
    >
      <div className={styles.layout}>
        <div className={styles.list}>
          <h3 key={props.id}>{props.name}</h3>
          {props.id && (
            <button className={styles.btn} onClick={props.toggleHandler}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M18.9369 6.69383L13.2816 6.18057L11.0733 0.742401C10.676 -0.247467 9.32059 -0.247467 8.92332 0.742401L6.71497 6.19279L1.07141 6.69383C0.0431826 6.77938 -0.377456 8.12364 0.405399 8.83244L4.69357 12.7186L3.40829 18.4867C3.1746 19.5377 4.26125 20.3687 5.14926 19.8065L9.99829 16.7514L14.8473 19.8188C15.7353 20.3809 16.822 19.5499 16.5883 18.4989L15.303 12.7186L19.5912 8.83244C20.374 8.12364 19.9651 6.77938 18.9369 6.69383Z"
                  fill={props.favoriteFill}
                />
              </svg>
            </button>
          )}
        </div>
        <div className={styles.list_info}>
          <p>{props.address}</p>
          <p>{props.phone}</p>
        </div>
        <div className={styles.actions}>
          {listCategory && (
            <p className={styles.list_category}>{listCategory}</p>
          )}
          {props.roadData && (
            <div>
              <img src={kmIcon} alt="km" />
              <p>{props.roadData + "km"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MapList);
