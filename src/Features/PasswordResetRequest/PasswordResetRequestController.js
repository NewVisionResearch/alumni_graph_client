import { useState } from "react";
import { Toast } from "react-bootstrap";

import PasswordResetRequestContainer from "./PasswordResetRequestContainer";
import { passwordResetRequest } from "../../services/api";

import "./styles/PasswordResetRequest.css";

function PasswordResetRequestController() {
    const [email, setEmail] = useState("");
    const [passwordResetRequestError, setPasswordResetRequestError] =
        useState("");
    const [
        showPasswordResetRequestErrorToast,
        setShowPasswordResetRequestErrorToast,
    ] = useState(false);
    const [
        showPasswordResetRequestSuccessfulToast,
        setShowPasswordResetRequestSuccessfulToast,
    ] = useState(false);

    const handleSubmitClick = () => {
        let emailObj = {
            password_reset: {
                email: email,
            },
        };

        passwordResetRequest(emailObj)
            .then((res) => {
                setShowPasswordResetRequestErrorToast(false);
                setPasswordResetRequestError("");
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then((request) => {
                setEmail("");
                setShowPasswordResetRequestSuccessfulToast(true);
            })
            .catch((err) => {
                return err.json().then((errorResponse) => {
                    setShowPasswordResetRequestErrorToast(true);
                    console.log(errorResponse);
                    setPasswordResetRequestError(errorResponse.text);
                    setShowPasswordResetRequestErrorToast(true);
                    setPasswordResetRequestError(errorResponse.text);
                });
            });
    };

    return (
        <div>
            <PasswordResetRequestContainer
                email={email}
                setEmail={setEmail}
                handleSubmitClick={handleSubmitClick}
            />
            <Toast
                className="password-reset-request-error-toast"
                animation={true}
                show={showPasswordResetRequestErrorToast}
                onClose={() => setShowPasswordResetRequestErrorToast(false)}
            >
                <Toast.Header>
                    <strong className="mr-auto">Error</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>{passwordResetRequestError}</Toast.Body>
            </Toast>
            <Toast
                className="password-reset-request-success-toast"
                animation={true}
                show={showPasswordResetRequestSuccessfulToast}
                onClose={() =>
                    setShowPasswordResetRequestSuccessfulToast(false)
                }
            >
                <Toast.Header>
                    <strong className="mr-auto">Success!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>
                    Your password has been successfully reset!
                </Toast.Body>
            </Toast>
        </div>
    );
}

export default PasswordResetRequestController;
