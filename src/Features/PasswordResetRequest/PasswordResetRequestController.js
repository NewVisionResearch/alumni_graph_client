import { useState } from "react";

import PasswordResetRequestContainer from "./PasswordResetRequestContainer";
import { ToastContext } from "../../Context/ToastContext/ToastContext";
import { passwordResetRequest } from "../../services/api";

import "./styles/PasswordResetRequest.css";
import { useContext } from "react";

function PasswordResetRequestController() {
    const showToast = useContext(ToastContext);

    const [email, setEmail] = useState("");
    const [passwordResetRequestError, setPasswordResetRequestError] =
        useState("");
    const [
        isSubmittingPasswordResetRequest,
        setIsSubmittingPasswordResetRequest,
    ] = useState(false);

    const handleSubmitClick = async () => {
        let emailObj = {
            password_reset: {
                email: email,
            },
        };

        setIsSubmittingPasswordResetRequest(true);
        setPasswordResetRequestError("");

        try {
            const res = await passwordResetRequest(emailObj);

            if (!res.ok) throw res;

            setEmail("");
            showToast({
                header: "Success!",
                body: "Your request has been sent!",
            });
        } catch (err) {
            const error = await err.json();

            setPasswordResetRequestError(error.text);
        } finally {
            setIsSubmittingPasswordResetRequest(false);
        }
    };

    return (
        <PasswordResetRequestContainer
            email={email}
            setEmail={setEmail}
            handleSubmitClick={handleSubmitClick}
            passwordResetRequestError={passwordResetRequestError}
            isSubmittingPasswordResetRequest={isSubmittingPasswordResetRequest}
        />
    );
}

export default PasswordResetRequestController;
