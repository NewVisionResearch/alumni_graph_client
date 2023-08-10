import React, { useState, useEffect, useRef } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import NavBar from "./Containers/NavBar";
import Graph from "./Containers/Graph";
import Dashboard from "./Containers/Dashboard";
import LoginContainer from "./Containers/LoginContainer";
import RegisterContainer from "./Containers/RegisterContainer";
import Approve from "./Containers/Approve";
import Deny from "./Containers/Deny";
import PasswordReset from "./Containers/PasswordReset";
import PasswordResetRequest from "./Containers/PasswordResetRequest";
import ErrorPage from "./Containers/ErrorPage";
import { AdminContext } from "./Context/Context";
import Menu from "./Containers/Menu";
import useAdmin from "./hooks/useAdmin";

import "./App.css";

function App() {
  console.log(
    "%cCreated by:                Ian Rosen irosen419@gmail.com",
    "display: inline-block ; border: 3px solid red ; border-radius: 7px ; " +
    "padding: 10px ;"
  );

  const navigate = useRef(useNavigate());
  const { pathname } = useLocation();
  const { admin, login, logout, loginError, clearLoginError } = useAdmin();

  const [aspectRatio, setAspectRatio] = useState(
    (window.innerHeight * window.innerWidth) / 1000000
  );
  const [
    showPasswordResetSuccessfulToast,
    setShowPasswordResetSuccessfulToast,
  ] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setAspectRatio((window.innerHeight * window.innerWidth) / 10000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    // If JWT exists and the user's email is set, they are logged in.
    if (token && admin.email) {
      if (pathname === "/login" || pathname === "/register") {
        navigate.current("/dashboard", { replace: true });
      } else {
        navigate.current(pathname, { replace: true }); // Stay or navigate to the current route.
      }
    } else {
      // If JWT doesn't exist and the user is not logged in:
      if (
        admin.email === "" &&
        (pathname === "/login" || pathname === "/register")
      ) {
        // Let them stay on /login or /register
      } else if (pathname.includes("/dashboard")) {
        navigate.current("/login", { replace: true });
      } else if (
        pathname.includes("/approve") ||
        pathname.includes("/deny") ||
        pathname.includes("/password-reset")
      ) {
        navigate.current(pathname, { replace: true });
      } else {
        navigate.current(pathname, { replace: true }); // In other cases, navigate to the current route.
      }
    }
  }, [pathname, admin.email, loginError]);

  return (
    <AdminContext.Provider value={admin}>
      <React.Fragment>
        <div id="App" style={{ height: "100vh", width: "100vw" }}>
          {admin.email === "" ? <Menu show={true} /> : <NavBar logout={logout} />}
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/graph/1" replace={true} />}
            />
            <Route
              path="/graph"
              element={<Navigate to="/graph/1" replace={true} />}
            />
            <Route
              path="/graph/:labId"
              element={<Graph aspectRatio={aspectRatio} />}
            />
            <Route
              path="/login"
              element={
                <LoginContainer
                  login={login}
                  loginError={loginError}
                  showPasswordResetSuccessfulToast={
                    showPasswordResetSuccessfulToast
                  }
                  setShowPasswordResetSuccessfulToast={
                    setShowPasswordResetSuccessfulToast
                  }
                  clearLoginError={clearLoginError}
                />
              }
            />
            <Route
              path="/register"
              element={
                <RegisterContainer />
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/approve/:token" element={<Approve />} />
            <Route path="/deny/:token" element={<Deny />} />
            <Route
              path="/password-reset-request"
              element={<PasswordResetRequest />}
            />
            <Route
              path="/password-reset/:token"
              element={
                <PasswordReset
                  setShowPasswordResetSuccessfulToast={
                    setShowPasswordResetSuccessfulToast
                  }
                />
              }
            />
            <Route
              path="/*"
              element={<Navigate to="/error" replace={true} />}
            />
          </Routes>
        </div>
      </React.Fragment>
    </AdminContext.Provider>
  );
}

export default App;
