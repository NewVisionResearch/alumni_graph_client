import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import LoginComponent from "../Components/LoginComponent";

function LoginContainer({ login, loginError, showPasswordResetSuccessfulToast, setShowPasswordResetSuccessfulToast, clearLoginError }) {

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
    <LoginComponent
      admin={admin}
      setAdmin={setAdmin}
      viewPassword={viewPassword}
      setViewPassword={setViewPassword}
      handleLogin={handleLogin}
      handleResetPasswordClick={handleResetPasswordClick}
      loginError={loginError}
      showPasswordResetSuccessfulToast={showPasswordResetSuccessfulToast}
      setShowPasswordResetSuccessfulToast={setShowPasswordResetSuccessfulToast}
      clearLoginError={clearLoginError}
    />
  );
}

export default LoginContainer;
