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
  const [input, setInput] = useState([]);

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
    if (currentValue === "0" && event.target.textContent === "0") {
      return null;
    } else if (currentValue === "0" && event.target.textContent !== "0") {
      setCurrentValue(event.target.textContent);
    } else if (currentValue !== "0") {
      setCurrentValue(`${currentValue}${event.target.textContent}`);
    }

    if (input.length > 0) {
      if (input[input.length - 1] === "+" || input[input.length - 1] === "-" ||
      input[input.length - 1] === "/" || input[input.length - 1] === "*") {
        setCurrentValue(event.target.textContent);
      } else if (input[input.length - 1] === "=") {
        setCurrentValue(event.target.textContent);
      } else if (input[input.length - 1] === "1/𝑥" || reciprocalClicked) {
        setCurrentValue(event.target.textContent);
      }
    }

    const newInput = input;
    newInput.push(event.target.textContent);
    setInput(input);
    setStoredValue(input.join(""));
  };

  const handleEqualsClick = event => {
    if (event.target.name !== "equals" && event.target.textContent !== "=" &&
    event.target.id !== "equals" && event.target.tagName !== "BUTTON") {
      return null;
    }

    const stored = storedValue;
    try {
      const calculatedValue = math.evaluate(stored);
      setCurrentValue(`${calculatedValue}`);
    } catch (err) {
      console.log(`Error occurred: ${err}`);
    }

    const newInput = input;
    newInput.push(event.target.textContent);
    setInput(newInput);
    setStoredValue(input.join(""));

    // empty the input array except for this "=" click
    setInput(["="]);
  };

  const handleOperatorClick = event => {
    if (input.length > 0) {
      // if "=" was clicked, we haeve to use the result from the previous
      // calculation for a new one now
      if (input[input.length - 1] === "=") {
        // reset storedValue and the input array to default values
        setStoredValue("");
        const newInput = [];
        setInput(newInput);

        // set input array and storedValue to equal the result from the
        // previous calculation with the operator that was clicked appended to it
        newInput.push(currentValue);
        newInput.push(event.target.textContent);
        setInput(newInput);
        setStoredValue(input.join(""));
        console.log(input);
      } else if (input[input.length - 1] === "1/𝑥" || reciprocalClicked) {
        const newInput = input;
        newInput.push(event.target.textContent);
        setInput(newInput);
        setStoredValue(input.join(""));
      }
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
    newInput.push(`(1/${currentValue})`);

    try {
      const calculatedValue = math.evaluate(`1/${currentValue}`);
      setCurrentValue(calculatedValue);
    } catch (err) {
      console.log(`Error: ${err}`);
    }

    setInput(input);
    setStoredValue(input.join(""));
  };

  const handleDecimalClick = event => {
    if (!currentValue.includes(event.target.textContent)) {
      setCurrentValue(currentValue.concat(event.target.textContent));
      const newInput = input;
      if (currentValue === "0.") {
        newInput.push(currentValue.charAt(0));
      }
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
