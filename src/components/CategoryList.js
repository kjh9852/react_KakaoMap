import { useState } from "react";
import category from "../Atom/Category";
import Modal from "./Modal";

import styles from "./CategoryList.module.css";

const CategoryList = (props) => {
  const [isActive, setIsActive] = useState(false);

  const onCategoryHandler = (data) => {
    setIsActive(() => {
      return data.code;
    });
    if(data === isActive) {
      setIsActive('');
    }
    props.onCategory(data.code);
    props.onCategorySrc(data.src);
  };

  const list = category.map((data) => (
    <li
      onClick={onCategoryHandler.bind(null, data)}
      className={`${styles.category_list} ${data.code === isActive ? styles.active : ''}`}
      key={data.code}
      code={data.code}
    >
      <p>{data.summary}</p>
    </li>
  ));

  return (
    <Modal openModal={props.openMenu}>
      <ul className={styles.category}>{list}</ul>
    </Modal>
  );
};

export default CategoryList;
