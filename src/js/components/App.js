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
  const [input, setInput] = useState([]);
  const operators = ["+", "-", "*", "/"];

  const handleNumberClick = event => {
    if (currentValue === "0" && event.target.textContent === "0") {
      return null;
    } else if ((currentValue === "0" && event.target.textContent !== "0") ||
    equalsClicked) {
      setCurrentValue(event.target.textContent);

      // reset it to make sure other click handlers don't misunderstand
      setReciprocalClicked(false);
      setEqualsClicked(false);
    }

    if (input.length > 0) {
      if (operators.includes(input[input.length - 1])) {
        setCurrentValue(event.target.textContent);
      } else if (!isNaN(input[input.length - 1]) || input[input.length - 1] === ".") {
        setCurrentValue(`${currentValue}${event.target.textContent}`);
      }
    }

    const newInput = input;
    newInput.push(event.target.textContent);
    setInput(newInput);
    setStoredValue(input.join(""));
    console.log(storedValue);
  };

  const handleEqualsClick = event => {
    if (event.target.name !== "equals" && event.target.textContent !== "=" &&
    event.target.id !== "equals" && event.target.tagName !== "BUTTON") {
      return null;
    }

    setEqualsClicked(true);

    const config = {
      epsilon: 1e-12,
      matrix: "Matrix",
      number: "number",
      precision: 64,
      predictable: false,
      randomSeed: null
    };
    const math = create(all, config);

    const stored = storedValue;
    try {
      console.log(stored);
      stored.trim();
      const calculatedValue = math.round(1000000000000 * math.evaluate(stored)) / 1000000000000;
      setCurrentValue(`${calculatedValue}`);
    } catch (err) {
      console.log(`Error occurred: ${err}`);
    }

    console.log(input);
    const newInput = input;
    newInput.length = 0;
    setInput(newInput);
    setStoredValue(`${stored}${event.target.textContent}`);
  };

  const handleOperatorClick = event => {
    if (input.length > 0) {
      // handle 2 or more operators clicked in a row
      if (operators.includes(input[input.length - 1]) && event.target.textContent !== "-") {
        // take the previously clicked operator out of the input array
        const newInput = input;
        newInput.splice(-1, 1);
        setInput(newInput);
      }
    }

    // take the result of the previous evaluation for a new calculation
    if (equalsClicked) {
      // This means equals button was clicked (can be like this in other cases too but still)
      // set input array and storedValue to equal the result from the
      // previous calculation
      const newInput = input;
      newInput.push(currentValue);
      setInput(newInput);

      // reset to false to make sure other click handlers don't misunderstand
      setEqualsClicked(false);
    } else if (reciprocalClicked) {
      const newInput = input;
      newInput.push(event.target.textContent);
      setInput(newInput);

      // reset to false to make sure other click handlers don't misunderstand
      setReciprocalClicked(false);
    }

    const newInput = input;
    newInput.push(event.target.textContent);
    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handleClearClick = () => {
    setCurrentValue("0");
    setStoredValue("");
    setInput([]);
  };

  const handleClearEntryClick = () => {
    setCurrentValue("0");
  };

  const handleBackSpaceClick = () => {
    if (currentValue.length === 1) {
      setCurrentValue("0");
    } else if (currentValue.length > 1) {
      // set currentValue to a string with the last element cut off
      const newValue = currentValue.slice(0, currentValue.length - 1);
      setCurrentValue(newValue);
    }
  };

  const handleReciprocalClick = event => {
    setReciprocalClicked(true);
    const newInput = input;

    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of reciprocal operation
    for (let i = 0; i < currentValue.length; i++) {
      newInput.pop();
    }
    newInput.push(`(1/${currentValue})`);

    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handleDecimalClick = event => {
    if (currentValue.includes(event.target.textContent)) {
      return null;
    } else {
      const newInput = input;
      if (currentValue === "0") {
        newInput.push(currentValue);
      }
      setCurrentValue(currentValue.concat(event.target.textContent));
      newInput.push(event.target.textContent);
      setInput(newInput);
      setStoredValue(input.join(""));
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
      } else if (event.target.name === "backspace") {
        handleBackSpaceClick();
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
