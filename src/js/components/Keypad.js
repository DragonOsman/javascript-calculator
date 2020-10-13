import React from "react";
import Button from "./Button";
import PropTypes from "prop-types";

const buttons = [{
  name: "percentage",
  value: "%",
  id: "percentage",
  className: "function keypad-button percentage"
}, {
  name: "clear-entry",
  value: "CE",
  id: "clear-entry",
  className: "effect keypad-button clear-entry"
}, {
  name: "clear",
  value: "C",
  id: "clear",
  className: "effect keypad-button clear"
}, {
  name: "backspace",
  value: "\u232b",
  id: "backspace",
  className: "effect keypad-button backspace"
}, {
  name: "reciprocal-function",
  value: "1/𝑥",
  id: "reciprocal",
  className: "function keypad-button reciprocal"
}, {
  name: "square-function",
  value: "𝑥²",
  id: "square",
  className: "function keypad-button square"
}, {
  name: "square-root-function",
  value: "²√𝑥",
  id: "square-root",
  className: "function keypad-button square-root"
}, {
  name: "divide",
  value: "/",
  id: "divide",
  className: "operator keypad-button divide"
}, {
  name: "number-button",
  value: "7",
  id: "seven",
  className: "number keypad-button seven"
}, {
  name: "number-button",
  value: "8",
  id: "eight",
  className: "number keypad-button eight"
}, {
  name: "number-button",
  value: "9",
  id: "nine",
  className: "number keypad-button nine"
}, {
  name: "multiply",
  value: "*",
  id: "multiply",
  className: "operator keypad-button multiply"
}, {
  name: "number-button",
  value: "4",
  id: "four",
  className: "number keypad-button four"
}, {
  name: "number-button",
  value: "5",
  id: "five",
  className: "number keypad-button five"
}, {
  name: "number-button",
  value: "6",
  id: "six",
  className: "number keypad-button six"
}, {
  name: "minus",
  value: "-",
  id: "subtract",
  className: "operator keypad-button minus"
}, {
  name: "number-button",
  value: "1",
  id: "one",
  className: "number keypad-button one"
}, {
  name: "number-button",
  value: "2",
  id: "two",
  className: "number keypad-button two"
}, {
  name: "number-button",
  value: "3",
  id: "three",
  className: "number keypad-button three"
}, {
  name: "add",
  value: "+",
  id: "add",
  className: "operator keypad-button add"
}, {
  name: "sign-switch",
  value: "±",
  id: "sign-switch",
  className: "number-helper keypad-button sign-switch"
}, {
  name: "number-button",
  value: "0",
  id: "zero",
  className: "number keypad-button zero"
}, {
  name: "decimal",
  value: ".",
  id: "decimal",
  className: "number-helper keypad-button decimal"
}, {
  name: "equals",
  value: "=",
  id: "equals",
  className: "calculation-submit keypad-button equals"
}];

const Keypad = props => {
  return (
    <div id="keypad" className="keypad">
      {buttons.map((object, index) => (
        <Button
          key={index}
          className={object.className}
          id={object.id}
          name={object.name}
          value={object.value}
          clickHandler={props.clickHandler}
        />
      ))}
    </div>
  );
};
Keypad.propTypes = {
  clickHandler: PropTypes.func.isRequired
};

export default Keypad;
