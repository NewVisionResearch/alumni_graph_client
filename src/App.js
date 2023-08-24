import React, { useState, useEffect, useRef } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import NavBar from "./Containers/NavBar";
import GraphContainer from "./Containers/GraphContainer";
import DashboardContainer from "./Containers/DashboardContainer";
import LoginContainer from "./Containers/LoginContainer";
import RegisterContainer from "./Containers/RegisterContainer";
import ApproveContainer from "./Containers/ApproveContainer";
import Deny from "./Containers/Deny";
import PasswordReset from "./Containers/PasswordResetContainer";
import PasswordResetRequestContainer from "./Containers/PasswordResetRequestContainer";
import ErrorPageComponent from "./Components/ErrorPageComponent";
import { AdminContext } from "./Context/Context";
import Menu from "./Components/Menu";
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

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    // If JWT exists and the user's email is set, they are logged in:
    if (token && admin.email) {
      if (pathname === "/login" || pathname === "/register") {
        navigate.current("/dashboard");
      } else {
        // Stay at current route.
      }
    } else if (!token && admin.email === "") {
      // If JWT doesn't exist and user's email is NOT set, they are NOT logged in:
      if (pathname === "/login" || pathname === "/register") {
        // Let them stay on /login or /register
      } else if (pathname.includes("/dashboard")) {
        navigate.current("/login");
      }
    }
  }, [pathname, admin.email, token]);

  return (
    <AdminContext.Provider value={admin}>
      <React.Fragment>
        <div id="App" style={{ height: "100vh", width: "100vw" }}>
          {admin.email === "" ? (
            <Menu show={true} />
          ) : (
            <NavBar logout={logout} />
          )}
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
              element={<GraphContainer aspectRatio={aspectRatio} />}
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
            <Route path="/register" element={<RegisterContainer />} />
            <Route path="/dashboard" element={<DashboardContainer />} />
            <Route path="/error" element={<ErrorPageComponent />} />
            <Route path="/approve/:token" element={<ApproveContainer />} />
            <Route path="/deny/:token" element={<Deny />} />
            <Route
              path="/password-reset-request"
              element={<PasswordResetRequestContainer />}
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
