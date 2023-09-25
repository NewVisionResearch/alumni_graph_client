import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import LoginContainer from "./LoginContainer";

function LoginController({
    login,
    loginError,
    showPasswordResetSuccessfulToast,
    setShowPasswordResetSuccessfulToast,
    clearLoginError,
    isLoggingIn,
}) {
    let navigate = useNavigate();
    const location = useLocation();

    const [admin, setAdmin] = useState({ email: "", password: "" });
    const [viewPassword, setViewPassword] = useState(false);

    const handleResetPasswordClick = () => {
        navigate("/password-reset-request");
    };

    const handleLogin = (admin) => {
        setAdmin({ email: "", password: "" });
        login(admin);
    };

    useEffect(() => {
        clearLoginError();
    }, [location.pathname, clearLoginError]);

    return (
        <LoginContainer
            admin={admin}
            setAdmin={setAdmin}
            viewPassword={viewPassword}
            setViewPassword={setViewPassword}
            handleLogin={handleLogin}
            handleResetPasswordClick={handleResetPasswordClick}
            loginError={loginError}
            showPasswordResetSuccessfulToast={showPasswordResetSuccessfulToast}
            setShowPasswordResetSuccessfulToast={
                setShowPasswordResetSuccessfulToast
            }
            clearLoginError={clearLoginError}
            isLoggingIn={isLoggingIn}
        />
    );
}

export default LoginController;
