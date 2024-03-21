const NavList = (props) => {
  return (
    <>
      <li onClick={props.onActiveHandler} data-label={props.title}>
        <img src={props.src} alt={props.title} />
        <span style={props.isActive ? {color: "#1A73E8"} : {color: "#222222"}}>{props.title}</span>
      </li>
    </>
  );
};

export default NavList;
