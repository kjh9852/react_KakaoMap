import category from "../Atom/Category";
import Modal from "./Modal";

import styles from "./CategoryList.module.css";

const CategoryList = (props) => {
    
  const onCategoryHandler = (data) => {
    props.onCategory(data);
  };
  const list = category.map((data) => (
    <li
      onClick={onCategoryHandler.bind(null, data.code)}
      className={styles.category_list}
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
