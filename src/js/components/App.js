import React, { useState, useEffect } from "react";
import exprEval from "expr-eval";
import Keypad from "./Keypad";
import Display from "./Display";

const buttons = [{
  name: "memory-clear",
  value: "MC",
  type: "memory-function",
  id: "memory-clear",
  className: "memory-function"
}, {
  name: "memory-recall",
  value: "MR",
  type: "memory-function",
  id: "memory-recall",
  className: "memory-function"
}, {
  name: "memory-add",
  value: "M+",
  type: "memory-function",
  id: "memory-add",
  className: "memory-function"
}, {
  name: "memory-subtract",
  value: "M-",
  type: "memory-function",
  id: "memory-subtract",
  className: "memory-function"
}, {
  name: "memory-store",
  value: "MS",
  type: "memory-function",
  id: "memory-store",
  className: "memory-function"
}, {
  name: "memory", // brings up a dropdown showing the number stored in memory
  value: "M▾",
  type: "memory-function",
  id: "memory",
  className: "memory-function"
}, {
  name: "percentage",
  value: "%",
  type: "function",
  id: "percentage",
  className: "function"
}, {
  name: "clear-entry",
  value: "CE",
  type: "effect",
  id: "clear-everything",
  className: "effect"
}, {
  name: "clear",
  value: "C",
  type: "effect",
  id: "clear",
  className: "effect"
}, {
  name: "backspace",
  value: "\u232b",
  type: "effect",
  id: "backspace",
  className: "effect"
}, {
  name: "reciprocal-function",
  value: "1/𝑥",
  type: "function",
  id: "reciprocal",
  className: "function"
}, {
  name: "square-function",
  value: "𝑥²",
  type: "function",
  id: "square",
  className: "function"
}, {
  name: "square-root-function",
  value: "²√𝑥",
  type: "function",
  id: "square-root",
  className: "function"
}, {
  name: "divide",
  value: "÷",
  type: "operator",
  id: "divide",
  className: "operator"
}, {
  name: "number-button",
  value: "7",
  type: "number",
  id: "seven",
  className: "number"
}, {
  name: "number-button",
  value: "8",
  type: "number",
  id: "eight",
  className: "number"
}, {
  name: "number-button",
  value: "9",
  type: "number",
  id: "nine",
  className: "number"
}, {
  name: "multiply",
  value: "×",
  type: "operator",
  id: "multiply",
  className: "operator"
}, {
  name: "number-button",
  value: "4",
  type: "number",
  id: "four",
  className: "number"
}, {
  name: "number-button",
  value: "5",
  type: "number",
  id: "five",
  className: "number"
}, {
  name: "number-button",
  value: "6",
  type: "number",
  id: "six",
  className: "number"
}, {
  name: "minus",
  value: "-",
  type: "operator",
  id: "subtract",
  className: "operator"
}, {
  name: "number-button",
  value: "1",
  type: "number",
  id: "one",
  className: "number"
}, {
  name: "number-button",
  value: "2",
  type: "number",
  id: "two",
  className: "number"
}, {
  name: "number-button",
  value: "3",
  type: "number",
  id: "three",
  className: "number"
}, {
  name: "sign-switch",
  value: "±",
  type: "effect",
  id: "sign-switch",
  className: "number-helper"
}, {
  name: "number-button",
  value: "0",
  type: "number",
  id: "zero",
  className: "number"
}, {
  name: "decimal",
  value: ".",
  type: "effect",
  id: "decimal",
  className: "number-helper"
}, {
  name: "equals",
  value: "=",
  type: "calculation-submit",
  id: "equals",
  className: "calculation-submit"
}];

const App = props => {
  const [currentValue, setCurrentValue] = useState("0");
  // const [currentMemoryValue, setMemory] = useState("");
  const [storedValue, setStoredValue] = useState("");

  useEffect(() => {
    const handleNumberButtonClick = event => {
      if (event.target.name === "number-button") {
        if (currentValue === "0") {
          setCurrentValue(event.target.textContent);
        } else {
          setCurrentValue(currentValue.concat(event.target.textContent));
        }
      }
    };

    // calculate the result for the current
    // value and display it, then reset the
    // stored value to empty string
    const parser = new exprEval.Parser();
    const handleEqualsButtonClick = event => {
      if (event.target.textContent === "=") {
        setStoredValue(storedValue.concat(currentValue));
        setCurrentValue(parser.parse(storedValue).evaluate());
        setStoredValue("");
      }
    };

    document.addEventListener("click", handleEqualsButtonClick);
    document.addEventListener("click", handleNumberButtonClick);

    return () => {
      document.removeEventListener("click", handleNumberButtonClick);
      document.removeEventListener("click", handleEqualsButtonClick);
    };
  });

  return (
    <React.Fragment>
      <Display
        storedValue={storedValue}
        currentValue={currentValue}
      />
      {buttons.map((object, index) =>
        <Keypad
          key={index}
          className={object.className}
          id={object.id}
          name={object.name}
          value={object.value}
        />
      )}
    </React.Fragment>
  );
};

export default App;
