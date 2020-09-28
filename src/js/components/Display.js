import React from "react";
import PropTypes from "prop-types";

const Display = props => {
  return (
    <div id="display-container">
      <p className="formula">{props.storedValue}</p>
      <br />
      <p id="display">{props.currentValue}</p>
    </div>
  );
};
Display.propTypes = {
  storedValue: PropTypes.string.isRequired,
  currentValue: PropTypes.string.isRequired
};

export default Display;
