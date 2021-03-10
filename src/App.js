
import React, { useState, useEffect } from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import Login from './Containers/Login'
import { Route, Switch, useHistory } from 'react-router-dom'
import './App.css'

function App() {

  const [admin, setAdmin] = useState({ username: "" })
  let history = useHistory()
  const token = localStorage.getItem('jwt')

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      history.push("/dashboard")
    } else {
      history.push("/")
    }
  }, [history])

  const login = (e, adminInfo) => {
    e.preventDefault()

    const { username, password } = adminInfo
    let adminObj = {
      admin: {
        username: username,
        password: password
      }
    }
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(adminObj)
    }

    fetch('http://localhost:3000/api/v1/login', options)
      .then(res => res.json())
      .then((admin) => {
        const { username, jwt } = admin
        localStorage.setItem('jwt', jwt)
        setAdmin({ username })
      })
      .then(() => history.push('/dashboard'))
  }



  return (
    <React.Fragment>
      <div style={{ height: '100%' }} id="App">
        {token ? <NavBar /> : null}
        <Switch>
          <Route exact path="/" component={Graph} />
          <Route path="/login" render={() => <Login login={login} />} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
