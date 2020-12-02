import React from "react";
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
