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
  const [percentageClicked, setPercentageClicked] = useState(false);
  const [squareRootClicked, setSquareRootClicked] = useState(false);
  const [equalsClicked, setEqualsClicked] = useState(false);
  const [input, setInput] = useState([]);
  const operators = ["+", "-", "*", "/"];

  const handleNumberClick = event => {
    const button = event.target;
    if (currentValue === "0" && button.textContent === "0") {
      return null;
    } else if ((currentValue === "0" && button.textContent !== "0") ||
    equalsClicked || reciprocalClicked || percentageClicked || squareRootClicked) {
      setCurrentValue(button.textContent);
      const newInput = [...input, button.textContent];
      setInput(newInput);

      // reset it to make sure other click handlers don't misunderstand
      setReciprocalClicked(false);
      setEqualsClicked(false);
      setPercentageClicked(false);
      setSquareRootClicked(false);
    }

    if (input.length > 0) {
      if (operators.includes(input[input.length - 1])) {
        setCurrentValue(button.textContent);
        const newInput = [...input, button.textContent];
        setInput(newInput);
        setStoredValue(newInput.join(""));
      } else if (!isNaN(input[input.length - 1]) || input[input.length - 1] === ".") {
        setCurrentValue(`${currentValue}${button.textContent}`);
        const newInput = [...input, button.textContent];
        setInput(newInput);
        setStoredValue(newInput.join(""));
      } else if (input[input.length - 1].endsWith("^2")) {
        setCurrentValue(button.textContent);
        const newInput = [...input, button.textContent];
        setInput(newInput);
        setStoredValue(newInput.join(""));
      }
    }

    const newInput = [...input, button.textContent];
    setInput(newInput);
    setStoredValue(newInput.join(""));
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

    const newInput = [...input, currentValue];
    setStoredValue(newInput.join(""));

    const stored = storedValue;
    try {
      const calculatedValue = math.round(1000000000000 * math.evaluate(stored)) / 1000000000000;
      setCurrentValue(`${calculatedValue}`);
    } catch (err) {
      console.log(`Error occurred: ${err}`);
    }

    newInput.length = 0;
    setInput(newInput);
    setStoredValue(`${stored}${event.target.textContent}`);
  };

  const handleOperatorClick = event => {
    const button = event.target;
    if (input.length > 0) {
      // handle 2 or more operators clicked in a row
      if (operators.includes(input[input.length - 1]) && button !== "-") {
        // take the previously clicked operator(s) out of the input array
        // and add in newly clicked one
        let newInput = [...input];
        newInput = newInput.filter(elem => !operators.includes(elem));
        newInput.push(button.textContent);
        setInput(newInput);
        setStoredValue(newInput.join(""));
      } else if (input[input.length - 1].endsWith("^2")) {
        const newInput = [...input, button.textContent];
        setInput(newInput);
        setStoredValue(newInput.join(""));
      }
    }

    // take the result of the previous evaluation for a new calculation
    if (equalsClicked) {
      // This means equals button was clicked (can be like this in other cases too but still)
      // set input array and storedValue to equal the result from the
      // previous calculation
      const newInput = [...input, currentValue, button.textContent];
      setInput(newInput);
      setStoredValue(newInput.join(""));

      // reset to false to make sure other click handlers don't misunderstand
      setEqualsClicked(false);
    } else if (reciprocalClicked || squareRootClicked) {
      const newInput = [...input, button.textContent];
      setInput(newInput);
      setStoredValue(newInput.join(""));

      // reset to false to make sure other click handlers don't misunderstand
      setReciprocalClicked(false);
      setSquareRootClicked(false);
    }

    const newInput = [...input, button.textContent];
    setInput(newInput);
    setStoredValue(newInput.join(""));
  };

  const handlePercentageClick = () => {
    setPercentageClicked(true);

    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of percentage operation
    for (let i = 0; i < currentValue.length; i++) {
      setInput(input.splice(i, 1));
    }

    const newInput = [...input, `(${currentValue}/100)`];
    setInput(newInput);
    setStoredValue(newInput.join(""));
  };

  const handleSquareClick = () => {
    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of square operation
    for (let i = 0; i < currentValue.length; i++) {
      setInput(input.splice(i, 1));
    }

    const newInput = [...input, `(${currentValue})^2`];
    setInput(newInput);
    setStoredValue(newInput.join(""));
  };

  const handleSquareRootClick = () => {
    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of square root operation
    for (let i = 0; i < currentValue.length; i++) {
      setInput(input.splice(i, 1));
    }

    const newInput = [...input, `sqrt(${currentValue})`];
    setInput(newInput);
    setStoredValue(newInput.join(""));
  };

  const handleClearClick = () => {
    setCurrentValue("0");
    setStoredValue("");
    const newInput = [...input];
    newInput.length = 0;
    setInput(newInput);
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

    // remove value from currentValue by itsef from input array
    // and leave it only inside parentheses of reciprocal operation
    for (let i = 0; i < currentValue.length; i++) {
      setInput(input.splice(i, 1));
    }

    const newInput = [...input, `(1/${currentValue})`];
    setInput(newInput);
    setStoredValue(newInput.join(""));
  };

  const handleDecimalClick = event => {
    const button = event.target;
    if (currentValue.includes(button.textContent)) {
      return null;
    }

    setCurrentValue(currentValue.concat(button.textContent));

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

    if (currentValue === "0" && !input.includes("0")) {
      setInput([...input, currentValue]);
    }

    let fixedString = "";
    if (currentValue.startsWith("0")) {
      fixedString = currentValue.substring(1);
      setCurrentValue(fixedString);
    }
    setInput([...input, button.textContent]);
  };

  const handleSignSwitchClick = () => {
    if (Math.sign(Number(currentValue)) === 1) {
      setCurrentValue(`-${currentValue}`);
      const newInput = [...input];
      newInput[newInput.length - 1] = `-${newInput[newInput.length - 1]}`;
      setInput(newInput);
      setStoredValue(newInput.join(""));
    } else if (Math.sign(Number(currentValue)) === -1) {
      const positiveNum = Math.abs(Number(currentValue));
      setCurrentValue(positiveNum.toString());
      const newInput = [...input];
      newInput[newInput.length - 1] = `${Math.abs(Number(newInput[newInput.length - 1]))}`;
      setInput(newInput);
      setStoredValue(newInput.join(""));
    }
  };

  useEffect(() => {
    const buttonElems = document.getElementsByClassName("keypad-button");
    const buttonsArr = [...buttonElems];
    for (let i = 0; i < buttonsArr.length; i++) {
      if (buttonsArr[i].name === "percentage") {
        buttonsArr[i].addEventListener("click", handlePercentageClick);
      } else if (buttonsArr[i].name === "clear-entry") {
        buttonsArr[i].addEventListener("click", handleClearEntryClick);
      } else if (buttonsArr[i].name === "clear") {
        buttonsArr[i].addEventListener("click", handleClearClick);
      } else if (buttonsArr[i].name === "backspace") {
        buttonsArr[i].addEventListener("click", handleBackSpaceClick);
      } else if (buttonsArr[i].name === "reciprocal-function") {
        buttonsArr[i].addEventListener("click", handleReciprocalClick);
      } else if (buttonsArr[i].name === "square-function") {
        buttonsArr[i].addEventListener("click", handleSquareClick);
      } else if (buttonsArr[i].name === "square-root-function") {
        buttonsArr[i].addEventListener("click", handleSquareRootClick);
      } else if (buttonsArr[i].name === "divide" || buttonsArr[i].name === "minus" ||
                 buttonsArr[i].name === "multiply" || buttonsArr[i].name === "add") {
        buttonsArr[i].addEventListener("click", handleOperatorClick);
      } else if (buttonsArr[i].name === "number-button") {
        buttonsArr[i].addEventListener("click", handleNumberClick);
      } else if (buttonsArr[i].name === "sign-switch") {
        buttonsArr[i].addEventListener("click", handleSignSwitchClick);
      } else if (buttonsArr[i].name === "decimal") {
        buttonsArr[i].addEventListener("click", handleDecimalClick);
      } else if (buttonsArr[i].name === "equals") {
        buttonsArr[i].addEventListener("click", handleEqualsClick);
      }
    }

    return () => {
      for (let i = 0; i < buttonsArr.length; i++) {
        if (buttonsArr[i].name === "percentage") {
          buttonsArr[i].removeEventListener("click", handlePercentageClick);
        } else if (buttonsArr[i].name === "clear-entry") {
          buttonsArr[i].removeEventListener("click", handleClearEntryClick);
        } else if (buttonsArr[i].name === "clear") {
          buttonsArr[i].removeEventListener("click", handleClearClick);
        } else if (buttonsArr[i].name === "backspace") {
          buttonsArr[i].removeEventListener("click", handleBackSpaceClick);
        } else if (buttonsArr[i].name === "reciprocal-function") {
          buttonsArr[i].removeEventListener("click", handleReciprocalClick);
        } else if (buttonsArr[i].name === "square-function") {
          buttonsArr[i].removeEventListener("click", handleSquareClick);
        } else if (buttonsArr[i].name === "square-root-function") {
          buttonsArr[i].removeEventListener("click", handleSquareRootClick);
        } else if (buttonsArr[i].name === "divide" || buttonsArr[i].name === "minus" ||
                   buttonsArr[i].name === "multiply" || buttonsArr[i].name === "add") {
          buttonsArr[i].removeEventListener("click", handleOperatorClick);
        } else if (buttonsArr[i].name === "number-button") {
          buttonsArr[i].removeEventListener("click", handleNumberClick);
        } else if (buttonsArr[i].name === "sign-switch") {
          buttonsArr[i].removeEventListener("click", handleSignSwitchClick);
        } else if (buttonsArr[i].name === "decimal") {
          buttonsArr[i].removeEventListener("click", handleDecimalClick);
        } else if (buttonsArr[i].name === "equals") {
          buttonsArr[i].removeEventListener("click", handleEqualsClick);
        }
      }
    };
  });

  useEffect(() => {
    setStoredValue(input.join(""));
  }, [input, storedValue]);

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
