
import React, { useState } from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import Login from './Containers/Login'
import { Route, Switch } from 'react-router-dom'
import './App.css'

function App() {

  const [admin, setAdmin] = useState(null)

  const login = (e, adminInfo) => {
    e.preventDefault()
    console.log("Loggin in: ", adminInfo)
  }

  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Graph} />
        <Route path="/login" render={() => <Login login={login} />} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
