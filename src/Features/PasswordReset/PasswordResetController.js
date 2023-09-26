import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PasswordResetContainer from "./PasswordResetContainer";
import { ToastContext } from "../../Context/ToastContext/ToastContext";
import { passwordReset } from "../../services/api";

import "./styles/PasswordReset.css";

function PasswordResetController() {
    const { token } = useParams();

    let navigate = useNavigate();

    const showToast = useContext(ToastContext);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const [passwordResetErrors, setPasswordResetErrors] = useState([]);
    const [isInvalid, setIsInvalid] = useState(false);

    const handleSubmitClick = () => {
        if (password === confirmPassword) {
            setIsInvalid(false);

            let passwordObj = {
                password_reset: {
                    password_digest: password,
                },
            };

            passwordReset(token, passwordObj)
                .then((res) => {
                    setPasswordResetErrors([]);
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then((request) => {
                    setPassword("");
                    setConfirmPassword("");
                    showToast({
                        header: "Password Reset Success!",
                        body: "Your password has been reset.",
                    });
                    navigate("/login");
                })
                .catch((err) => {
                    return err.json().then((errorResponse) => {
                        console.error(errorResponse);

                        setPasswordResetErrors(errorResponse.errors);
                    });
                });
        } else {
            setIsInvalid(true);
        }
    };

    return (
        <PasswordResetContainer
            password={password}
            confirmPassword={confirmPassword}
            viewPassword={viewPassword}
            viewConfirmPassword={viewConfirmPassword}
            isInvalid={isInvalid}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setViewPassword={setViewPassword}
            setViewConfirmPassword={setViewConfirmPassword}
            setIsInvalid={setIsInvalid}
            handleSubmitClick={handleSubmitClick}
            passwordResetErrors={passwordResetErrors}
        />
    );
}

export default PasswordResetController;
