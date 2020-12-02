import React from "react";
import { Route, Switch } from "react-router-dom";
import MainPage from "./views/MainPage";

// react-router is the project used to shift between different routes. 
// Swith is like an if else condition. If the url matches the patchc in the
// path param, the corresponding component is rendered.
// If exact matching is not needed, exact is not necessary.

const Routes = () => (
  <Switch>
    <Route path="/" exact component={MainPage} />
  </Switch>
);

export default Routes;
