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
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};

export default Keypad;
