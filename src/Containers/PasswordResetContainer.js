import { useState } from "react";
import { Toast } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import PasswordResetComponent from "../Components/PasswordResetComponent";
import { passwordReset } from "../services/api";

import "../styles/PasswordReset.css";

function PasswordResetContainer({ setShowPasswordResetSuccessfulToast }) {
    const { token } = useParams();

    let navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const [passwordResetError, setPasswordResetError] = useState("");
    const [showPasswordResetErrorToast, setShowPasswordResetErrorToast] =
        useState(false);
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
                    setShowPasswordResetErrorToast(false);
                    setPasswordResetError("");
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then((request) => {
                    setPassword("");
                    setConfirmPassword("");
                    setShowPasswordResetSuccessfulToast(true);
                    navigate("/login");
                })
                .catch((err) => {
                    return err.json().then((errorResponse) => {
                        console.error(errorResponse);
                        setShowPasswordResetErrorToast(true);
                        setPasswordResetError(err.errors);
                    });
                });
        } else {
            setIsInvalid(true);
        }
    };

    return (
        <div>
            <PasswordResetComponent
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
            />
            <Toast
                className="password-reset-error-toast"
                animation={true}
                show={showPasswordResetErrorToast}
                onClose={() => setShowPasswordResetErrorToast(false)}
            >
                <Toast.Header>
                    <strong className="mr-auto">Error</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>{passwordResetError}</Toast.Body>
            </Toast>
        </div>
    );
}

export default PasswordResetContainer;
