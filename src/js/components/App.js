import React, { useState } from "react";
import Keypad from "./Keypad";
import Display from "./Display";
import { create, all } from "mathjs";

const App = props => {
  const [currentValue, setCurrentValue] = useState("0");
  const [storedValue, setStoredValue] = useState("");
  const [reciprocalClicked, setReciprocalClicked] = useState(false);
  const [percentageClicked, setPercentageClicked] = useState(false);
  const [squareRootClicked, setSquareRootClicked] = useState(false);
  const [equalsClicked, setEqualsClicked] = useState(false);
  const [input, setInput] = useState([]);
  const operators = ["+", "-", "*", "/"];

  const handleNumberClick = event => {
    if (currentValue === "0" && event.target.textContent === "0") {
      return null;
    } else if ((currentValue === "0" && event.target.textContent !== "0") ||
    equalsClicked || reciprocalClicked || percentageClicked || squareRootClicked) {
      setCurrentValue(event.target.textContent);

      // reset it to make sure other click handlers don't misunderstand
      setReciprocalClicked(false);
      setEqualsClicked(false);
      setPercentageClicked(false);
      setSquareRootClicked(false);
    }

    if (input.length > 0) {
      if (operators.includes(input[input.length - 1])) {
        setCurrentValue(event.target.textContent);
      } else if (!isNaN(input[input.length - 1]) || input[input.length - 1] === ".") {
        setCurrentValue(`${currentValue}${event.target.textContent}`);
      } else if (input[input.length - 1].endsWith("^2")) {
        setCurrentValue(event.target.textContent);
      }
    }

    const newInput = input;
    newInput.push(event.target.textContent);
    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handleEqualsClick = event => {
    if (event.target.name !== "equals" && event.target.textContent !== "=" &&
    event.target.id !== "equals" && event.target.tagName !== "BUTTON") {
      return null;
    }

    if (event.target.id === "fcc_test_suite_wrapper" || event.target.classList.contains("fcc_test_ui") ||
        event.target.id === "fcc_foldout_toggler" || event.target.id === "hamburger_top" ||
        event.target.id === "hamburger-middle" || event.target.id === "hamburger-bottom") {
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
      const calculatedValue = math.round(1000000000000 * math.evaluate(stored)) / 1000000000000;
      setCurrentValue(`${calculatedValue}`);
    } catch (err) {
      console.log(`Error occurred: ${err}`);
    }

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
        setStoredValue(input.join(""));
      } else if (input[input.length - 1].endsWith("^2")) {
        const newInput = input;
        newInput.push(event.target.textContent);
        setInput(newInput);
        setStoredValue(input.join(""));
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
      setStoredValue(input.join(""));

      // reset to false to make sure other click handlers don't misunderstand
      setEqualsClicked(false);
    } else if (reciprocalClicked || squareRootClicked) {
      const newInput = input;
      setInput(newInput);
      setStoredValue(input.join(""));

      // reset to false to make sure other click handlers don't misunderstand
      setReciprocalClicked(false);
      setSquareRootClicked(false);
    }

    const newInput = input;
    newInput.push(event.target.textContent);
    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handlePercentageClick = () => {
    setPercentageClicked(true);
    const newInput = input;

    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of percentage operation
    for (let i = 0; i < currentValue.length; i++) {
      newInput.pop();
    }
    newInput.push(`(${currentValue}/100)`);

    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handleSquareClick = () => {
    const newInput = input;

    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of square operation
    for (let i = 0; i < currentValue.length; i++) {
      newInput.pop();
    }
    newInput.push(`(${currentValue})^2`);

    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handleSquareRootClick = () => {
    const newInput = input;

    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of square root operation
    for (let i = 0; i < currentValue.length; i++) {
      newInput.pop();
    }
    newInput.push(`sqrt(${currentValue})`);

    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handleClearClick = () => {
    setCurrentValue("0");
    setStoredValue("");
    const newInput = input;
    newInput.length = 0;
    setInput(newInput);
    console.log(input);
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

  const handleReciprocalClick = () => {
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
    }

    setCurrentValue(currentValue.concat(event.target.textContent));

    let decimalCount = 0;
    for (let i = 0; i < currentValue.length; i++) {
      if (currentValue.charAt(i) === ".") {
        decimalCount++;
      }
    }

    if (decimalCount > 1) {
      for (let i = currentValue.indexOf(".") + 1; i < currentValue.length; i++) {
        if (currentValue.charAt(i) === ".") {
          currentValue.replace(".", "");
        }
      }
    }

    const newInput = input;
    if (currentValue === "0" && !input.includes("0")) {
      newInput.push(currentValue);
    }

    let fixedString = "";
    if (currentValue.startsWith("0")) {
      fixedString = currentValue.substring(1);
      setCurrentValue(fixedString);
    }
    newInput.push(event.target.textContent);
    setInput(newInput);
    setStoredValue(input.join(""));
  };

  const handleSignSwitchClick = () => {
    if (Math.sign(Number(currentValue)) === 1) {
      setCurrentValue(`-${currentValue}`);
      const newInput = input;
      newInput[newInput.length - 1] = `-${newInput[newInput.length - 1]}`;
      setInput(newInput);
      setStoredValue(input.join(""));
    } else if (Math.sign(Number(currentValue)) === -1) {
      const positiveNum = Math.abs(Number(currentValue));
      setCurrentValue(positiveNum.toString());
      const newInput = input;
      newInput[newInput.length - 1] = `${Math.abs(Number(newInput[newInput.length - 1]))}`;
      setInput(newInput);
      setStoredValue(input.join(""));
    }
  };

  const buttons = [{
    name: "percentage",
    value: "%",
    type: "function",
    id: "percentage",
    className: "function keypad-button",
    clickHandler: handlePercentageClick
  }, {
    name: "clear-entry",
    value: "CE",
    type: "effect",
    id: "clear-entry",
    className: "effect keypad-button",
    clickHandler: handleClearEntryClick
  }, {
    name: "clear",
    value: "C",
    type: "effect",
    id: "clear",
    className: "effect keypad-button",
    clickHandler: handleClearClick
  }, {
    name: "backspace",
    value: "\u232b",
    type: "effect",
    id: "backspace",
    className: "effect keypad-button",
    clickHandler: handleBackSpaceClick
  }, {
    name: "reciprocal-function",
    value: "1/𝑥",
    type: "function",
    id: "reciprocal",
    className: "function keypad-button",
    clickHandler: handleReciprocalClick
  }, {
    name: "square-function",
    value: "𝑥²",
    type: "function",
    id: "square",
    className: "function keypad-button",
    clickHandler: handleSquareClick
  }, {
    name: "square-root-function",
    value: "²√𝑥",
    type: "function",
    id: "square-root",
    className: "function keypad-button",
    clickHandler: handleSquareRootClick
  }, {
    name: "divide",
    value: "/",
    type: "operator",
    id: "divide",
    className: "operator keypad-button",
    clickHandler: handleOperatorClick
  }, {
    name: "number-button",
    value: "7",
    type: "number",
    id: "seven",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "number-button",
    value: "8",
    type: "number",
    id: "eight",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "number-button",
    value: "9",
    type: "number",
    id: "nine",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "multiply",
    value: "*",
    type: "operator",
    id: "multiply",
    className: "operator keypad-button",
    clickHandler: handleOperatorClick
  }, {
    name: "number-button",
    value: "4",
    type: "number",
    id: "four",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "number-button",
    value: "5",
    type: "number",
    id: "five",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "number-button",
    value: "6",
    type: "number",
    id: "six",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "minus",
    value: "-",
    type: "operator",
    id: "subtract",
    className: "operator keypad-button",
    clickHandler: handleOperatorClick
  }, {
    name: "number-button",
    value: "1",
    type: "number",
    id: "one",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "number-button",
    value: "2",
    type: "number",
    id: "two",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "number-button",
    value: "3",
    type: "number",
    id: "three",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "add",
    value: "+",
    type: "operator",
    id: "add",
    className: "operator keypad-button",
    clickHandler: handleOperatorClick
  }, {
    name: "sign-switch",
    value: "±",
    type: "effect",
    id: "sign-switch",
    className: "number-helper keypad-button",
    clickHandler: handleSignSwitchClick
  }, {
    name: "number-button",
    value: "0",
    type: "number",
    id: "zero",
    className: "number keypad-button",
    clickHandler: handleNumberClick
  }, {
    name: "decimal",
    value: ".",
    type: "effect",
    id: "decimal",
    className: "number-helper keypad-button",
    clickHandler: handleDecimalClick
  }, {
    name: "equals",
    value: "=",
    type: "calculation-submit",
    id: "equals",
    className: "calculation-submit keypad-button",
    clickHandler: handleEqualsClick
  }];

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
            clickHandler={object.clickHandler}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default App;
