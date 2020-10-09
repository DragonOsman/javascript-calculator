import React from "react";
import PropTypes from "prop-types";

const Button = props => {
  return (
    <React.Fragment>
      <button
        className={props.className}
        id={props.id}
        name={props.name}
        onClick={props.clickHandler}
      >
        { props.value }
      </button>
    </React.Fragment>
  );
};
Button.propTypes = {
  className: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired
};

export default Button;
