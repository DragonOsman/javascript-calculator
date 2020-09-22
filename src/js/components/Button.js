import React from "react";
import PropTypes from "prop-types";

const Button = props => {
  return (
    <React.Fragment>
      <button
        className={props.className}
        id={props.id}
        name={props.name}
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
  name: PropTypes.string.isRequired
};

export default Button;
