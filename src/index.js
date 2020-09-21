import React from "react";
import ReactDOM from "react-dom";
import App from "./js/components/App";
import "./style.css";

// Opt-in to Webpack hot module replacement
if (module.hot) {
  module.hot.accept();
}

const rootDiv = document.getElementById("root");
ReactDOM.render(<App />, rootDiv);
