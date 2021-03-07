
import React from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import { Route, Switch } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Graph} />
        <Route path="/dashboard" render={() => <Dashboard />} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
