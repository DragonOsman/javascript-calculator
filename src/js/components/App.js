import React, { useState, useEffect } from "react";
import Keypad from "./Keypad";
import Display from "./Display";
import { create, all } from "mathjs";

const buttons = [{
  name: "percentage",
  value: "%",
  type: "function",
  id: "percentage",
  className: "function keypad-button"
}, {
  name: "clear-entry",
  value: "CE",
  type: "effect",
  id: "clear-entry",
  className: "effect keypad-button"
}, {
  name: "clear",
  value: "C",
  type: "effect",
  id: "clear",
  className: "effect keypad-button"
}, {
  name: "backspace",
  value: "\u232b",
  type: "effect",
  id: "backspace",
  className: "effect keypad-button"
}, {
  name: "reciprocal-function",
  value: "1/𝑥",
  type: "function",
  id: "reciprocal",
  className: "function keypad-button"
}, {
  name: "square-function",
  value: "𝑥²",
  type: "function",
  id: "square",
  className: "function keypad-button"
}, {
  name: "square-root-function",
  value: "²√𝑥",
  type: "function",
  id: "square-root",
  className: "function keypad-button"
}, {
  name: "divide",
  value: "/",
  type: "operator",
  id: "divide",
  className: "operator keypad-button"
}, {
  name: "number-button",
  value: "7",
  type: "number",
  id: "seven",
  className: "number keypad-button"
}, {
  name: "number-button",
  value: "8",
  type: "number",
  id: "eight",
  className: "number keypad-button"
}, {
  name: "number-button",
  value: "9",
  type: "number",
  id: "nine",
  className: "number keypad-button"
}, {
  name: "multiply",
  value: "*",
  type: "operator",
  id: "multiply",
  className: "operator keypad-button"
}, {
  name: "number-button",
  value: "4",
  type: "number",
  id: "four",
  className: "number keypad-button"
}, {
  name: "number-button",
  value: "5",
  type: "number",
  id: "five",
  className: "number keypad-button"
}, {
  name: "number-button",
  value: "6",
  type: "number",
  id: "six",
  className: "number keypad-button"
}, {
  name: "minus",
  value: "-",
  type: "operator",
  id: "subtract",
  className: "operator keypad-button"
}, {
  name: "number-button",
  value: "1",
  type: "number",
  id: "one",
  className: "number keypad-button"
}, {
  name: "number-button",
  value: "2",
  type: "number",
  id: "two",
  className: "number keypad-button"
}, {
  name: "number-button",
  value: "3",
  type: "number",
  id: "three",
  className: "number keypad-button"
}, {
  name: "add",
  value: "+",
  type: "operator",
  id: "add",
  className: "operator keypad-button"
}, {
  name: "sign-switch",
  value: "±",
  type: "effect",
  id: "sign-switch",
  className: "number-helper keypad-button"
}, {
  name: "number-button",
  value: "0",
  type: "number",
  id: "zero",
  className: "number keypad-button"
}, {
  name: "decimal",
  value: ".",
  type: "effect",
  id: "decimal",
  className: "number-helper keypad-button"
}, {
  name: "equals",
  value: "=",
  type: "calculation-submit",
  id: "equals",
  className: "calculation-submit keypad-button"
}];

const App = props => {
  const [currentValue, setCurrentValue] = useState("0");
  const [storedValue, setStoredValue] = useState("");
  const [reciprocalClicked, setReciprocalClicked] = useState(false);
  const [equalsClicked, setEqualsClicked] = useState(false);
  const operators = ["+", "-", "/", "*"];

  const config = {
    epsilon: 1e-12,
    matrix: "Matrix",
    number: "number",
    precision: 64,
    predictable: false,
    randomSeed: null
  };

  const math = create(all, config);
  const handleNumberClick = event => {
    if (event.target.textContent === "0" && currentValue === "0") {
      setCurrentValue(event.target.textContent);
    }

    if (currentValue !== "0") {
      setCurrentValue(`${currentValue}${event.target.textContent}`);
    } else if (operators.includes(storedValue[storedValue.length - 1]) || reciprocalClicked) {
      setCurrentValue(event.target.textContent);
    } else if (equalsClicked) {
      setStoredValue("");
      setCurrentValue(event.target.textContent);
    }
  };

  const handleEqualsClick = event => {
    if (event.target.tagName === "BUTTON" &&
    event.target.classList.contains("keypad-button") &&
    event.target.classList.contains("calculation-submit")) {
      setEqualsClicked(true);
      const stored = `${storedValue}${currentValue}`;
      try {
        const calculatedValue = math.evaluate(stored);
        setCurrentValue(`${calculatedValue}`);
      } catch (err) {
        console.log(`${err}`);
      }

      setStoredValue(`${stored}${event.target.textContent}`);
    }
  };

  const handleOperatorClick = event => {
    if (reciprocalClicked) {
      setStoredValue(`${storedValue}${event.target.textContent}`);
    } else if (equalsClicked) {
      setStoredValue(`${currentValue}${event.target.textContent}`);
    }

    // if stored ends with an operator already, except -
    // (for negative values) remove that last substring
    if (storedValue.endsWith("+") || storedValue.endsWith("/") ||
        storedValue.endsWith("*")) {
      storedValue.slice(-1);
    }

    if (storedValue !== "") {
      setStoredValue(`${storedValue}${event.target.textContent}`);
    } else if (storedValue === "") {
      setStoredValue(`${currentValue}${event.target.textContent}`);
    }
  };

  const handleClearClick = () => {
    setStoredValue("");
    setCurrentValue("0");
  };

  const handleClearEntryClick = () => {
    setCurrentValue("0");
  };

  const handleReciprocalClick = event => {
    setReciprocalClicked(true);

    if (equalsClicked) {
      setStoredValue(`(1/${currentValue})`);
      const calculatedValue = math.evaluate(storedValue);
      setCurrentValue(`${calculatedValue}`);
    }

    if (storedValue.length === 0) {
      const calculationStr = `1/${currentValue}`;
      const calculatedValue = math.evaluate(calculationStr);
      setCurrentValue(`${calculatedValue}`);
      setStoredValue(`(1/${currentValue})`);
    } else if (storedValue.length > 0) {
      const calculatedStr = `${storedValue}(1/${currentValue})`;
      const calculatedValue = math.evaluate(calculatedStr);
      setCurrentValue(`${calculatedValue}`);
      setStoredValue(`${storedValue}(1${currentValue})`);
    }
  };

  const handleDecimalClick = event => {
    if (!currentValue.includes(event.target.textContent)) {
      setCurrentValue(currentValue.concat(event.target.textContent));
    }
  };

  const clickHandler = event => {
    if (event.target.classList.contains("keypad-button")) {
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
      } else if (event.target.name === "reciprocal-function") {
        handleReciprocalClick(event);
      } else if (event.target.name === "decimal") {
        handleDecimalClick(event);
      }
    } else {
      return null;
    }
  };

  useEffect(() => {
    const keypadDiv = document.getElementById("keypad");
    keypadDiv.addEventListener("click", clickHandler);

    return () => {
      keypadDiv.removeEventListener("click", clickHandler);
    };
  });

  return (
    <React.Fragment>
      <Display
        storedValue={storedValue}
        currentValue={currentValue}
      />
      <div id="keypad">
        {buttons.map((object, index) =>
          <Keypad
            key={index}
            className={object.className}
            id={object.id}
            name={object.name}
            value={object.value}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default App;
