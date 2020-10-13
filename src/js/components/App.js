import React, { useState } from "react";
import Keypad from "./Keypad";
import Display from "./Display";
import { create, all } from "mathjs";

const App = props => {
  const [displayedValue, setDisplayedValue] = useState("0");
  const [formulaString, setFormulaString] = useState("");
  const [reciprocalClicked, setReciprocalClicked] = useState(false);
  const [percentageClicked, setPercentageClicked] = useState(false);
  const [squareRootClicked, setSquareRootClicked] = useState(false);
  const [equalsClicked, setEqualsClicked] = useState(false);
  const [input, setInput] = useState([]);
  const operators = ["+", "-", "*", "/"];

  const handleNumberClick = event => {
    const button = event.target;
    const newInput = [...input];
    if (displayedValue === "0" && button.textContent === "0") {
      return null;
    } else if ((displayedValue === "0" && button.textContent !== "0") ||
    equalsClicked || reciprocalClicked || percentageClicked || squareRootClicked) {
      setDisplayedValue(button.textContent);

      // reset it to make sure other click handlers don't misunderstand
      setReciprocalClicked(false);
      setEqualsClicked(false);
      setPercentageClicked(false);
      setSquareRootClicked(false);
    }

    if (newInput.length > 0) {
      if (operators.includes(newInput[newInput.length - 1]) ||
      newInput[newInput.length - 1].endsWith("^2)")) {
        setDisplayedValue(button.textContent);
      } else if (!isNaN(newInput[newInput.length - 1]) || newInput[newInput.length - 1] === ".") {
        setDisplayedValue(`${displayedValue}${button.textContent}`);
      }
    }

    newInput.push(button.textContent);
    setInput(newInput);
    setFormulaString(newInput.join(""));
  };

  const handleEqualsClick = event => {
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

    const newInput = [...input, displayedValue];
    setFormulaString(newInput.join(""));

    const formula = formulaString;
    try {
      const calculatedValue = math.round(1000000000000 * math.evaluate(formula)) / 1000000000000;
      setDisplayedValue(`${calculatedValue}`);
    } catch (err) {
      console.log(`Error occurred: ${err}`);
    }

    setInput([]);
    if (!formulaString.endsWith("=")) {
      setFormulaString(`${formula}${event.target.textContent}`);
    } else {
      setFormulaString(formulaString);
    }
  };

  const handleOperatorClick = event => {
    const button = event.target;
    let newInput = [...input];
    if (input.length > 0) {
      // handle 2 or more operators clicked in a row
      if (operators.includes(newInput[newInput.length - 1]) && button.textContent !== "-") {
        // take the previously clicked operator(s) out of the input array
        // and add in newly clicked one
        newInput = newInput.filter(elem => !operators.includes(elem));
        setInput(newInput);
        setFormulaString(newInput.join(""));
      }
    }

    // take the result of the previous evaluation for a new calculation
    if (equalsClicked || displayedValue === "0") {
      // This means equals button was clicked (can be like this in other cases too but still)
      // set input array and storedValue to equal the result from the
      // previous calculation
      newInput = [...newInput, displayedValue];
      setInput(newInput);
      setFormulaString(newInput.join(""));

      // reset to false to make sure other click handlers don't misunderstand
      setEqualsClicked(false);
    } else if (reciprocalClicked || percentageClicked || squareRootClicked) {
      // We don't need to handle these specially, but we should still reset them here
      // so that other click handlers don't think they were clicked when they weren't
      setReciprocalClicked(false);
      setPercentageClicked(false);
      setSquareRootClicked(false);
    }

    newInput = [...newInput, button.textContent];
    setInput(newInput);
    setFormulaString(newInput.join(""));
  };

  const handlePercentageClick = () => {
    setPercentageClicked(true);
    const newInput = [...input];

    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of percentage operation
    for (let i = 0; i < displayedValue.length; i++) {
      newInput.pop();
      setInput(newInput);
    }

    newInput.push(`(${displayedValue}/100)`);
    setInput(newInput);
    setFormulaString(newInput.join(""));
  };

  const handleSquareClick = () => {
    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of square operation
    const newInput = [...input];
    for (let i = 0; i < displayedValue.length; i++) {
      newInput.pop();
      setInput(newInput);
    }

    newInput.push(`((${displayedValue})^2)`);
    setInput(newInput);
    setFormulaString(newInput.join(""));
  };

  const handleSquareRootClick = () => {
    const newInput = [...input];
    setSquareRootClicked(true);
    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of square root operation
    for (let i = 0; i < displayedValue.length; i++) {
      newInput.pop();
      setInput(newInput);
    }

    newInput.push(`sqrt(${displayedValue})`);
    setInput(newInput);
    setFormulaString(newInput.join(""));
  };

  const handleClearClick = () => {
    setDisplayedValue("0");
    setFormulaString("");
    const newInput = [...input];
    newInput.length = 0;
    setInput(newInput);
  };

  const handleClearEntryClick = () => {
    setDisplayedValue("0");
  };

  const handleBackSpaceClick = () => {
    if (!equalsClicked) {
      if (displayedValue.length === 1) {
        setDisplayedValue("0");
      } else if (displayedValue.length > 1) {
        // set currentValue to a string with the last element cut off
        const newValue = displayedValue.slice(0, displayedValue.length - 1);
        setDisplayedValue(newValue);
      }
    }

    let newInput = [...input];
    newInput = newInput.slice(0, newInput.length - 1);
    setInput(newInput);
    const stored = formulaString.slice(0, formulaString.length - 1);
    setFormulaString(stored);
  };

  const handleReciprocalClick = () => {
    setReciprocalClicked(true);

    const newInput = [...input];
    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of reciprocal operation
    for (let i = 0; i < displayedValue.length; i++) {
      newInput.pop();
      setInput(newInput);
    }

    newInput.push(`(1/${displayedValue})`);
    setInput(newInput);
    setFormulaString(newInput.join(""));
  };

  const handleDecimalClick = event => {
    const button = event.target;
    const newInput = [...input];
    if (displayedValue.includes(button.textContent)) {
      return null;
    }

    setDisplayedValue(displayedValue.concat(button.textContent));

    let decimalCount = 0;
    for (let i = 0; i < displayedValue.length; i++) {
      if (displayedValue.charAt(i) === ".") {
        decimalCount++;
      }
    }

    if (decimalCount > 1) {
      for (let i = displayedValue.indexOf(".") + 1; i < displayedValue.length; i++) {
        if (displayedValue.charAt(i) === ".") {
          displayedValue.replace(".", "");
        }
      }
    }

    if (displayedValue === "0" && !newInput.includes("0")) {
      newInput.push(displayedValue);
      setInput(newInput);
    }

    newInput.push(button.textContent);
    setInput(newInput);
  };

  const handleSignSwitchClick = () => {
    if (Math.sign(Number(displayedValue)) === 1) {
      setDisplayedValue(`-${displayedValue}`);
      const newInput = [...input];
      newInput[newInput.length - 1] = `-${newInput[newInput.length - 1]}`;
      setInput(newInput);
      setFormulaString(newInput.join(""));
    } else if (Math.sign(Number(displayedValue)) === -1) {
      const positiveNum = Math.abs(Number(displayedValue));
      setDisplayedValue(positiveNum.toString());
      const newInput = [...input];
      newInput[newInput.length - 1] = `${Math.abs(Number(newInput[newInput.length - 1]))}`;
      setInput(newInput);
      setFormulaString(newInput.join(""));
    }
  };

  const clickHandler = event => {
    const button = event.target;
    switch (button.id) {
      case "zero":
      case "one":
      case "two":
      case "three":
      case "four":
      case "five":
      case "six":
      case "seven":
      case "eight":
      case "nine":
        handleNumberClick(event);
        break;
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        handleOperatorClick(event);
        break;
      case "equals":
        handleEqualsClick(event);
        break;
      case "decimal":
        handleDecimalClick(event);
        break;
      case "clear":
        handleClearClick();
        break;
      case "clear-entry":
        handleClearEntryClick();
        break;
      case "percentage":
        handlePercentageClick();
        break;
      case "backspace":
        handleBackSpaceClick();
        break;
      case "reciprocal":
        handleReciprocalClick();
        break;
      case "square":
        handleSquareClick();
        break;
      case "square-root":
        handleSquareRootClick();
        break;
      case "sign-switch":
        handleSignSwitchClick();
        break;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Display
        storedValue={formulaString}
        currentValue={displayedValue}
      />
      <Keypad
        clickHandler={clickHandler}
      />
    </React.Fragment>
  );
};

export default App;
