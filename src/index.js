import './wdyr'; // <--- first import
import React from "react";
import ReactDOM from "react-dom";
import NewGrid from "./Grid";

ReactDOM.render(
  <NewGrid key={"gameBoard"}/>,
  document.getElementById("root")
);