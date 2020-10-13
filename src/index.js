import React from "react";
import ReactDOM from "react-dom";
import App from "./js/components/App";
import "./styles/style.css";

const rootDiv = document.getElementById("root");
rootDiv.classList.add("calculator-container");
ReactDOM.render(<App />, rootDiv);
