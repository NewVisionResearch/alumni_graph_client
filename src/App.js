
import React, { useState, useEffect, useCallback } from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import Login from './Containers/Login'
import { Route, Switch, useHistory } from 'react-router-dom'
import './App.css'
import ErrorPage from './Containers/ErrorPage'

function App() {
  const baseUrl = process.env.REACT_APP_BASE_URL

  let history = useHistory()
  const { location: { pathname } } = history

  const [admin, setAdmin] = useState({ username: "" })
  const [loginError, setLoginError] = useState("")
  const [aspectRatio, setAspectRatio] = useState(window.innerHeight * window.innerWidth / 1000000)

  window.addEventListener('resize', () => {
    setAspectRatio(window.innerHeight * window.innerWidth / 10000)
  })

  const memoizedPath = useCallback(
    () => {
      console.log('memoizing path')
      if (admin.username && pathname === "/login") {
        history.push("/dashboard")
      } else if (!admin.username) {
        history.push("/")
      } else {
        history.push(pathname)
      }
    }, [history, pathname, admin.username]
  )

  useEffect(() => {
    const token = localStorage.getItem('jwt')
    if (token) {
      fetch(`${baseUrl}/profile`, {
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
        .then(memoizedPath)

    } else {
      history.push("/")
    }
  }, [history, memoizedPath, baseUrl])

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

    fetch(`${baseUrl}/login`, options)
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
          <Route exact path="/" render={() => <Graph aspectRatio={aspectRatio} />} />
          <Route path="/login" render={() => <Login login={login} error={loginError} />} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/error" component={ErrorPage} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
