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
  id: "clear-entry",
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
  name: "add",
  value: "+",
  type: "operator",
  id: "add",
  className: "operator"
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
  const [equalsButtonClicked, setEqualsClicked] = useState(false);
  const [operatorButtonClicked, setOperatorClicked] = useState(false);

  const handleNumberClick = event => {
    if (!operatorButtonClicked && !equalsButtonClicked) {
      const newValue = currentValue.concat(event.target.textContent);
      setCurrentValue(newValue);
    } else if (!operatorButtonClicked && equalsButtonClicked) {
      setCurrentValue(event.target.textContent);
      setStoredValue("");
    } else if (operatorButtonClicked && !equalsButtonClicked) {
      setCurrentValue(event.target.textContent);
    }

    if (currentValue === "0") {
      setCurrentValue(event.target.textContent);
    }
  };

  const parser = new exprEval.Parser();
  const handleEqualsClick = event => {
    setEqualsClicked(true);
    const stored = `${storedValue}${currentValue}`;
    setStoredValue(stored);
    console.log(currentValue);
    if (storedValue.match(/[0-9]$/) === null) {
      setStoredValue(`${storedValue}${currentValue}`);
      console.log(storedValue);
    }
    console.log(storedValue);
    const calculatedValue = parser.parse(storedValue).evaluate();
    setCurrentValue(`${calculatedValue}`);
    setStoredValue(`${stored}${event.target.textContent}`);
  };

  const handleOperatorClick = event => {
    setOperatorClicked(true);
    let stored;

    // Have to set "/" and "*" characters for multiplication
    // and division because with event.target.textContent values,
    // expr-eval parser will error
    // And if stored value is not an empty string, append the current value
    // and the operator to it; otherwise, just set it to the current value
    // with the operator next to it.
    if (event.target.textContent === "+") {
      if (storedValue.length > 0) {
        stored = `${storedValue}${currentValue}${event.target.textContent}`;
      } else if (storedValue.length === 0) {
        stored = `${currentValue}${event.target.textContent}`;
      }
    } else if (event.target.textContent === "÷") {
      if (storedValue.length > 0) {
        stored = `${currentValue}${currentValue}/`;
      } else if (storedValue.length === 0) {
        stored = `${currentValue}/`;
      }
    } else if (event.target.textContent === "×") {
      if (storedValue.length > 0) {
        stored = `${storedValue}${currentValue}*`;
      } else if (storedValue.length === 0) {
        stored = `${currentValue}*`;
      }
    } else if (event.target.textContent === "-") {
      if (storedValue.length > 0) {
        stored = `${storedValue}${currentValue}${event.target.textContent}`;
      } else if (storedValue.length === 0) {
        stored = `${currentValue}${event.target.textContent}`;
      }
    }

    setStoredValue(stored);
  };

  const handleClearClick = () => {
    setStoredValue("");
    setCurrentValue("0");
  };

  const handleClearEntryClick = () => {
    setCurrentValue("0");
  };

  const clickHandler = event => {
    if (event.target.name === "number-button") {
      handleNumberClick(event);
    } else if (event.target.name === "add" || event.target.name === "minus" ||
    event.target.name === "multiply" || event.target.name === "divide") {
      handleOperatorClick(event);
    } else if (event.target.name === "clear") {
      handleClearClick();
    } else if (event.target.name === "clear-entry") {
      handleClearEntryClick();
    } else if (event.target.name === "equals") {
      handleEqualsClick(event);
    }
  };

  useEffect(() => {
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
      button.addEventListener("click", clickHandler);
    }

    return () => {
      for (const button of buttons) {
        button.removeEventListener("click", clickHandler);
      }
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
