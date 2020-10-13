import React from "react";
import PropTypes from "prop-types";

const Display = props => {
  return (
    <div className="screen">
      <div className="formula">
        <p className="formula-string">{props.storedValue}</p>
      </div>
      <div id="display" className="display">
        <p className="display-string">{props.currentValue}</p>
      </div>
    </div>
  );
};
Display.propTypes = {
  storedValue: PropTypes.string.isRequired,
  currentValue: PropTypes.string.isRequired
};

export default Display;
