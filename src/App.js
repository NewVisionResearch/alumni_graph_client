
import React, { useState, useEffect, useRef } from 'react';
import NavBar from './Containers/NavBar';
import Graph from './Containers/Graph';
import Dashboard from './Containers/Dashboard';
import Login from './Containers/Login';
import Register from './Containers/Register';
import Approve from './Containers/Approve';
import Deny from './Containers/Deny';
import PasswordReset from './Containers/PasswordReset';
import PasswordResetRequest from './Containers/PasswordResetRequest';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import ErrorPage from './Containers/ErrorPage';
import { AdminContext } from './Context/Context';

function App() {
  console.log(
    "%cCreated by:                Ian Rosen irosen419@gmail.com",
    "display: inline-block ; border: 3px solid red ; border-radius: 7px ; " +
    "padding: 10px ;"
  );

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const navigate = useRef(useNavigate());
  const { pathname } = useLocation();

  const [admin, setAdmin] = useState({ email: "", labId: "" });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [aspectRatio, setAspectRatio] = useState(window.innerHeight * window.innerWidth / 1000000);
  const [showPasswordResetSuccessfulToast, setShowPasswordResetSuccessfulToast] = useState(false);

  window.addEventListener('resize', () => {
    setAspectRatio(window.innerHeight * window.innerWidth / 10000);
  });

  useEffect(() => {
    if (admin.email !== "" && (pathname === "/login" || pathname === "/register")) {
      navigate.current("/dashboard", { replace: true });
    }
  }, [pathname, admin.email]
  );

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('jwt');

    if (token !== null) {
      fetch(`${baseUrl}/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) { throw res; }
          return res.json();
        })
        .then((admin) => {
          const { email, labId } = admin;
          if (isMounted) {
            setAdmin({ email, labId });
          }
        })
        .catch((err) => console.error(err));
    }

    return () => {
      isMounted = false;
    };
  }, [baseUrl]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (token === null) {
      if (loginError !== "") {
        navigate.current("/login", { replace: true });
      } else if (admin.email === "" && pathname === "/login") {
        navigate.current("/login", { replace: true });
      } else if (admin.email === "" && pathname === "/register") {
        navigate.current("/register", { replace: true });
      } else if (admin.email === "" && pathname.includes("/dashboard")) {
        navigate.current("/login", { replace: true });
      } else if (pathname.includes("/approve") || pathname.includes("/deny")) {
        navigate.current(pathname, { replace: true });
      } else if (pathname.includes("/password-reset")) {
        navigate.current(pathname, { replace: true });
      } else if (admin.email !== "") {
        navigate.current(pathname, { replace: true });
      }
    }
  }, [pathname, admin.email, loginError]);

  const register = (e, labInfo, setShowRegisterToast, setLab) => {
    e.preventDefault();

    const { email, name, labName, phoneNumber, howToUse, labUrl } = labInfo;
    let requestObj = {
      request: {
        lab_name: labName.trim(),
        name: name.trim(),
        email: email.trim(),
        phone_number: phoneNumber,
        how_to_use: howToUse,
        lab_url: labUrl
      }
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestObj)
    };

    fetch(`${baseUrl}/requests`, options)
      .then(res => {
        setRegisterError("");
        console.log(res);
        if (!res.ok) { throw res; }
        return res.json();
      })
      .then((request) => {
        setLab({ email: "", name: "", labName: "", phoneNumber: "", howToUse: "", labUrl: "" });
        setShowRegisterToast(true);
        console.log("Request: ", request);
      })
      .catch((res) => res.json())
      .then((err) => {
        setLab((prev) => ({ ...prev, email: "" }));
        setRegisterError(err);
        console.log(err);
      });
  };

  const login = (e, adminInfo) => {
    e.preventDefault();

    const { email, password } = adminInfo;
    let adminObj = {
      admin: {
        email: email,
        password: password
      }
    };
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(adminObj)
    };

    fetch(`${baseUrl}/login`, options)
      .then(res => {
        if (!res.ok) { throw res; }
        return res.json();
      })
      .then((admin) => {
        const { email, labId, jwt } = admin;
        localStorage.setItem('jwt', jwt);
        setAdmin({ email, labId });
      })
      .then(() => navigate.current('/dashboard'))
      .catch((res) => res.text())
      .then((err) => setLoginError(err));
  };

  const logout = async () => {
    localStorage.removeItem("jwt");
    setAdmin({ email: "", labId: "" });
    navigate.current("/");
  };

  return (
    <AdminContext.Provider value={admin}>
      <React.Fragment>
        <div
          id="App"
          style={{ height: '100vh', width: '100vw' }}>
          {admin.email !== "" ? <NavBar logout={logout} /> : null}
          <Routes>
            <Route path="/" element={<Navigate to="/graph/1" replace={true} />} />
            <Route path="/graph" element={<Navigate to="/graph/1" replace={true} />} />
            <Route path="/graph/:labId" element={<Graph aspectRatio={aspectRatio} />} />
            <Route path="/login" element={<Login login={login} error={loginError} showPasswordResetSuccessfulToast={showPasswordResetSuccessfulToast} setShowPasswordResetSuccessfulToast={setShowPasswordResetSuccessfulToast} />} />
            <Route path="/register" element={<Register register={register} error={registerError} />} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/error" Component={ErrorPage} />
            <Route path="/approve/:token" Component={Approve} />
            <Route path="/deny/:token" Component={Deny} />
            <Route path="/password-reset-request" element={<PasswordResetRequest />} />
            <Route path="/password-reset/:token" element={<PasswordReset setShowPasswordResetSuccessfulToast={setShowPasswordResetSuccessfulToast} />} />
            <Route path="/*" element={<Navigate to="/error" replace={true} />} />
          </Routes>
        </div>
      </React.Fragment>
    </AdminContext.Provider>
  );
}

export default App;
