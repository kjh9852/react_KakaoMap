import { useState, useEffect, useRef } from "react";
import NavList from "./NavList";
import styles from "./MobileNavigation.module.css";

import list from "../images/list.png";
import star from "../images/star_border.png";
import category from "../images/category.png";

import listActive from "../images/list_active.png";
import starActive from "../images/star_active.png";
import categoryActive from "../images/category_active.png";

const menuList = [
  {
    title: "List",
    src: list,
    activeSrc: listActive
  },
  {
    title: "Favorite",
    src: star,
    activeSrc: starActive
  },
  {
    title: "Category",
    src: category,
    activeSrc: categoryActive
  },
];

const MobileNavigation = (props) => {
  const [isActive, setIsActive] = useState("");

  const onActiveHandler = (index) => {
    setIsActive(index)
    props.onActiveHandler(index);
    if(index === isActive) {
        setIsActive("");
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <ul className={styles.nav}>
          {menuList.map((list, index) => (
            <NavList
              key={index}
              onActiveHandler={() => onActiveHandler(index)}
              isActive={index === isActive}
              src={index === isActive ? list.activeSrc : list.src}
              title={list.title}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileNavigation;
