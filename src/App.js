
import React from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import { Route, Switch } from 'react-router-dom'

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Graph} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
