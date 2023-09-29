import React, { useEffect, useRef } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";

import GraphController from "./Features/Graph/GraphController";
import DashboardController from "./Features/Dashboard/DashboardController";
import LoginController from "./Features/Login/LoginController";
import RegisterController from "./Features/Register/RegisterController";
import ApproveController from "./Features/Approve/ApproveController";
import DenyController from "./Features/Deny/DenyController";
import PasswordResetController from "./Features/PasswordReset/PasswordResetController";
import PasswordResetRequestController from "./Features/PasswordResetRequest/PasswordResetRequestController";
import ErrorPageContainer from "./Features/ErrorPage/ErrorPageContainer";
import { AdminContext } from "./Context/AdminContext/AdminContext";
import { ToastProvider } from "./Context/ToastContext/ToastContext";
import MainLayout from "./Layout/MainLayout/MainLayout";
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
    const { admin, login, logout, loginError, clearLoginError, isLoggingIn } =
        useAdmin();

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
            <ToastProvider>
                <React.Fragment>
                    <div id="App">
                        <Routes>
                            <Route
                                path="/impact"
                                element={
                                    <Navigate to="/impact/1" replace={true} />
                                }
                            />

                            <Route
                                path="/impact/:labId"
                                element={<GraphController impactMode={true} />}
                            />

                            <Route
                                element={
                                    <MainLayout admin={admin} logout={logout} />
                                }
                            >
                                <Route
                                    path="/"
                                    element={
                                        <Navigate
                                            to="/graph/1"
                                            replace={true}
                                        />
                                    }
                                />
                                <Route
                                    path="/graph"
                                    element={
                                        <Navigate
                                            to="/graph/1"
                                            replace={true}
                                        />
                                    }
                                />
                                <Route
                                    path="/graph/:labId"
                                    element={
                                        <GraphController impactMode={false} />
                                    }
                                />
                                <Route
                                    path="/login"
                                    element={
                                        <LoginController
                                            login={login}
                                            loginError={loginError}
                                            clearLoginError={clearLoginError}
                                            isLoggingIn={isLoggingIn}
                                        />
                                    }
                                />
                                <Route
                                    path="/register"
                                    element={<RegisterController />}
                                />
                                <Route
                                    path="/dashboard"
                                    element={<DashboardController />}
                                />
                                <Route
                                    path="/error"
                                    element={<ErrorPageContainer />}
                                />
                                <Route
                                    path="/approve/:token"
                                    element={<ApproveController />}
                                />
                                <Route
                                    path="/deny/:token"
                                    element={<DenyController />}
                                />
                                <Route
                                    path="/password-reset-request"
                                    element={<PasswordResetRequestController />}
                                />
                                <Route
                                    path="/password-reset/:token"
                                    element={<PasswordResetController />}
                                />
                                <Route
                                    path="/*"
                                    element={
                                        <Navigate to="/error" replace={true} />
                                    }
                                />
                            </Route>
                        </Routes>
                    </div>
                </React.Fragment>
            </ToastProvider>
        </AdminContext.Provider>
    );
}

export default App;
