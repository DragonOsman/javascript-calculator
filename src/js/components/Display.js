import React from "react";
import PropTypes from "prop-types";

const Display = props => {
  return (
    <div id="display">
      <p id="stored">{props.storedValue}</p>
      <p id="current">{props.currentValue}</p>
    </div>
  );
};
Display.propTypes = {
  storedValue: PropTypes.string,
  currentValue: PropTypes.string
};

export default Display;
