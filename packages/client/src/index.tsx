import React from "react";
import ReactDOM from "react-dom";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./assets/theme/theme-maun.scss";
import "./assets/layout/css/layout-maun.scss";
import "./favicon.ico";
import { App } from "./containers/App";

ReactDOM.render(<App />, document.getElementById("root"));
