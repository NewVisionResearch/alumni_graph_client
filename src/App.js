
import React, { useState, useEffect, useRef } from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import Login from './Containers/Login'
import Register from './Containers/Register'
import Approve from './Containers/Approve'
import Deny from './Containers/Deny'
import PasswordReset from './Containers/PasswordReset'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import ErrorPage from './Containers/ErrorPage'
import { AdminContext } from './Context/Context'

function App() {
  console.log(
    "%cCreated by:                Ian Rosen irosen419@gmail.com",
    "display: inline-block ; border: 3px solid red ; border-radius: 7px ; " +
    "padding: 10px ;"
  );

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const navigate = useRef(useNavigate());
  const { pathname } = useLocation();

  const [admin, setAdmin] = useState({ username: "" , labId: ""});
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [aspectRatio, setAspectRatio] = useState(window.innerHeight * window.innerWidth / 1000000);
  const [showPasswordResetSuccessfulToast, setShowPasswordResetSuccessfulToast] = useState(false);
  
  window.addEventListener('resize', () => {
    setAspectRatio(window.innerHeight * window.innerWidth / 10000)
  })

    useEffect(() => {
      if (admin.username !== "" && (pathname === "/login" || pathname ==="/register")) {
        navigate.current("/dashboard");
      }
    }, [pathname, admin.username]
  )

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('jwt')

    if (token !== null) {
      fetch(`${baseUrl}/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) { throw res }
        return res.json()
      })
      .then((admin) => {
        const { username, labId } = admin
        if(isMounted){
          setAdmin({ username, labId });
        }
      })
      .catch((err) => console.error(err))
    } 

    return () => {
      isMounted = false;
    }
  }, [baseUrl])

  useEffect(() => {
    const token = localStorage.getItem('jwt')

    if(token === null ){
      if (loginError !== "") {
        navigate.current("/login")
      } else if (admin.username === "" && pathname === "/login") {
        navigate.current("/login")
      } else if (admin.username === "" && pathname === "/register") {
        navigate.current("/register")
      } else if (pathname.includes("/approve") || pathname.includes("/deny")) {
        navigate.current(pathname)
      } else if (pathname.includes("/password-reset")) {
        navigate.current(pathname)
      } else if (admin.username === "") {
        navigate.current(pathname)
      }
    }
  },[ pathname, admin.username, loginError])

  const register = (e, labInfo, setShowRegisterToast, setLab) => {
    e.preventDefault();

    const { email, username, labName } = labInfo
    let requestObj = {
      request: {
        lab_name: labName,
        username: username,
        email: email
      }
    }
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestObj)
    }

    fetch(`${baseUrl}/requests`, options)
      .then(res => {
        setRegisterError("")
        console.log(res)
        if (!res.ok) { throw res }
        return res.json()
      })
      .then((request) => {
        setLab({email: "", username: "", labName: "" })
        setShowRegisterToast(true);
        console.log("Request: ", request);
      })
      .catch((res) => res.json())
      .then((err) => {
        setLab((prev) => ({...prev, username: ""}));
        setRegisterError(err);
        console.log(err);
      })
  }

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
        const { username, labId, jwt } = admin
        localStorage.setItem('jwt', jwt)
        setAdmin({ username, labId })
      })
      .then(() => navigate.current('/dashboard'))
      .catch((res) => res.text())
      .then((err) => setLoginError(err))
  }

  const logout = async () => {
    localStorage.removeItem("jwt")
    setAdmin({ username: "", labId: "" })
    navigate.current("/")
  }

  return (
    <AdminContext.Provider value={admin}>    
      <React.Fragment>
        <div
          id="App"
          style={{ height: '100vh', width: '100vw' }}>
          {admin.username !== "" ? <NavBar logout={logout} /> : null}
          <Routes>
            <Route path="/" element={<Navigate to="/graph/1" />} />
            <Route path="/graph" element={<Navigate to="/graph/1" />} />
            <Route path="/graph/:labId" element={<Graph aspectRatio={aspectRatio} />} />
            <Route path="/login" element={<Login login={login} error={loginError} showPasswordResetSuccessfulToast={showPasswordResetSuccessfulToast} setShowPasswordResetSuccessfulToast={setShowPasswordResetSuccessfulToast} />} />
            <Route path="/register" element={<Register register={register} error={registerError} />} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/error" Component={ErrorPage} />
            <Route path="/approve/:token" Component={Approve} />
            <Route path="/deny/:token" Component={Deny} />
            <Route path="/password-reset/:token" element={<PasswordReset setShowPasswordResetSuccessfulToast={setShowPasswordResetSuccessfulToast}/>} />
            <Route path="/*" element={<Navigate to="/error" />} />
          </Routes>
        </div>
      </React.Fragment>
    </AdminContext.Provider>
  );
}

export default App;
