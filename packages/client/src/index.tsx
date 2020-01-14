import React from "react";
import ReactDOM from "react-dom";

import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "./assets/theme/theme-maun.scss";
import "./assets/layout/css/layout-maun.scss";
import "primeicons/primeicons.css";
import "./favicon.ico";
import { App } from "./containers/App";

ReactDOM.render(<App />, document.getElementById("root"));
