import React from "react";
import PropTypes from "prop-types";

const Display = props => {
  return (
    <div id="screen">
      <div id="formula">
        <p className="value">{props.storedValue}</p>
      </div>
      <div id="display">
        <p className="value">{props.currentValue}</p>
      </div>
    </div>
  );
};
Display.propTypes = {
  storedValue: PropTypes.string.isRequired,
  currentValue: PropTypes.string.isRequired
};

export default Display;
