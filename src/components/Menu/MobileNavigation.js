import { useState, useEffect } from "react";
import NavList from "./NavList";
import Error from "../UI/Error";
import styles from "./MobileNavigation.module.css";

import list from "../../images/list.png";
import star from "../../images/star_border.png";
import category from "../../images/category.png";
import listActive from "../../images/list_active.png";
import starActive from "../../images/star_active.png";
import categoryActive from "../../images/category_active.png";
// image

const menuList = [
  {
    title: "List",
    src: list,
    activeSrc: listActive,
  },
  {
    title: "Favorite",
    src: star,
    activeSrc: starActive,
  },
  {
    title: "Category",
    src: category,
    activeSrc: categoryActive,
  },
];

const MobileNavigation = (props) => {
  const [isActive, setIsActive] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if(props.openList) {
      setIsActive(0);
    } else return;
    if(props.openFavorite) {
      setIsActive(1);
    } else return;
  },[props.openFavorite, props.openList, isActive]);

  const onActiveHandler = (index) => {
    switch (index) {
      case 0:
        setIsActive(() => {
          if (props.list.length > 0) {
            return index;
          } else return setError(true);
        });
        break;
      case 1:
        setIsActive(() => {
          if (props.favorite.length > 0) {
            return index;
          } else return setError(true);
        });
        break;
      case 2:
        setIsActive(index);
        break;
      default:
        setError(true);
        break;
    }

    if (index === isActive) {
      setIsActive("");
    }
    props.onActiveHandler(index);
  };

  const onCancel = () => {
    setError(false);
  };

  const message = <Error onCancel={onCancel} message='리스트가 없습니다'/>

  return (
    <>
    {error && message}
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
  </>
  );
};

export default MobileNavigation;
