import React from "react";
import Button from "./Button";
import PropTypes from "prop-types";

const Keypad = props => {
  return (
    <Button
      className={props.className}
      id={props.id}
      name={props.name}
      value={props.value}
    />
  );
};
Keypad.propTypes = {
  className: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default Keypad;
