import list from '../images/list.png'
import star from '../images/star_border.png';
import category from '../images/category.png';

import listActive from '../images/list_active.png'
import starActive from '../images/star_active.png';
import categoryActive from '../images/category_active.png';

const NavList = (props) => {
  return (
    <>
      <li onClick={props.onActiveHandler} data-label={props.title}>
        <img src={props.src} alt={props.title} />
        <span style={props.isActive ? {color: "#1A73E8"} : {color: "#222222"}}>{props.title}</span>
      </li>
      {/* <li onClick={props.onActiveHandler} data-label='favorite' className={props.isActive ? 'active' : ''}>
        <img src={props.isActive ? starActive : star} alt="favorite" />
        <span>Favorite</span>
      </li>
      <li onClick={props.onActiveHandler} data-label='category' className={props.isActive ? 'active' : ''}>
        <img src={props.isActive ? categoryActive : category} alt="category" />
        <span>Category</span>
      </li> */}
    </>
  );
};

export default NavList;
