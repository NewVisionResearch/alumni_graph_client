
import React, { useState, useEffect } from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import Login from './Containers/Login'
import { Route, Switch, useHistory } from 'react-router-dom'
import './App.css'

function App() {
  let history = useHistory()
  const [admin, setAdmin] = useState({ username: "" })
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('jwt')
    if (token) {
      console.log('refreshed')
      fetch('http://localhost:3000/api/v1/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((admin) => {
          const { username } = admin
          setAdmin({ username })
        })
        .then(() => history.push("/dashboard"))

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
      .then(res => {
        if (!res.ok) { throw res }
        return res.json()
      })
      .then((admin) => {
        const { username, jwt } = admin
        localStorage.setItem('jwt', jwt)
        setAdmin({ username })
      })
      .then(() => history.push('/dashboard'))
      .catch((res) => res.text())
      .then((err) => setLoginError(err))
  }

  console.log(loginError)
  const logout = async () => {
    localStorage.removeItem("jwt")
    await setAdmin({ username: "" })
    history.push("/")
  }

  return (
    <React.Fragment>
      <div style={{ height: '100vh' }} id="App">
        {admin.username.length ? <NavBar logout={logout} /> : null}
        <Switch>
          <Route exact path="/" component={Graph} />
          <Route path="/login" render={() => <Login login={login} error={loginError} />} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
