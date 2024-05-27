import { useState, useEffect } from "react";
import NavList from "./NavList";
import Error from "../UI/Error";
import styles from "./MobileNavigation.module.css";

import list from "../../assets/images/list.png";
import star from "../../assets/images/star_border.png";
import category from "../../assets/images/category.png";
import listActive from "../../assets/images/list_active.png";
import starActive from "../../assets/images/star_active.png";
import categoryActive from "../../assets/images/category_active.png";
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
  const [isActive, setIsActive] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (props.listState.listOpen && props.list.length > 0) {
      setIsActive(0);
    }
    if (props.listState.favoriteOpen && props.favorite.length === 0) {
      setIsActive(null);
    }
  }, [props.listState, props.list, props.favorite]);
  // 메뉴 버튼 active로 전환

  const onActiveHandler = (index) => {
    switch (index) {
      case 0:
        if (props.list.length > 0) {
          setIsActive(index);
        } else {
          setError(true);
        }
        break;
      case 1:
        if (props.favorite.length > 0) {
          setIsActive(index);
        } else {
          setError(true);
        }
        break;
      case 2:
        setIsActive(index);
        break;
      default:
        setError(true);
        break;
    }

    if (index === isActive) {
      setIsActive(null);
    }
    props.onActiveHandler(index);
  };

  const onCancel = () => {
    setError(false);
  };

  const message = <Error onCancel={onCancel} message="리스트가 없습니다" />;

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
