import { useState } from "react";
import { Toast } from "react-bootstrap";

import PasswordResetRequestComponent from "../Components/PasswordResetRequestComponent";
import { passwordResetRequest } from "../services/api";

function PasswordResetRequestContainer() {
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
                    setPasswordResetRequestError(errorResponse.text); setShowPasswordResetRequestErrorToast(true);
                    setPasswordResetRequestError(errorResponse.text);
                });
            });
    };

    return (
        <div
            className="login d-flex flex-column justify-content-center align-items-center pt-5"
            style={{ width: "100%" }}
        >
            <PasswordResetRequestComponent
                email={email}
                setEmail={setEmail}
                handleSubmitClick={handleSubmitClick}
            />
            <Toast
                style={{
                    position: "absolute",
                    top: 10,
                    backgroundColor: "red",
                }}
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
                style={{
                    position: "absolute",
                    top: 10,
                    backgroundColor: "green",
                }}
                animation={true}
                show={showPasswordResetRequestSuccessfulToast}
                onClose={() => setShowPasswordResetRequestSuccessfulToast(false)}
            >
                <Toast.Header>
                    <strong className="mr-auto">Success!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>Your password has been successfully reset!</Toast.Body>
            </Toast>
        </div>
    );
}

export default PasswordResetRequestContainer;
