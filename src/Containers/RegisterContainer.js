import React, { useState } from "react";
import { Toast } from "react-bootstrap";

import RegisterComponent from "../Components/RegisterComponent";
import * as authService from "../services/authService";

function RegisterContainer() {
    const [lab, setLab] = useState({
        email: "",
        name: "",
        labName: "",
        phoneNumber: "",
        howToUse: "",
        labUrl: "",
    });
    const [showRegisterToast, setShowRegisterToast] = useState(false);
    const [registerError, setRegisterError] = useState("");

    const handleRegister = async (labInfo) => {
        try {
            const res = await authService.register(labInfo);

            if (!res.ok) throw res;

            const request = await res.json();

            setRegisterError("");
            // Resetting lab info after successful registration:
            setLab({
                email: "",
                name: "",
                labName: "",
                phoneNumber: "",
                howToUse: "",
                labUrl: "",
            });
            setShowRegisterToast(true);

            console.log("Request: ", request);
        } catch (error) {
            const err = await error.json();
            setLab((prev) => ({ ...prev, email: "" }));
            setRegisterError(err);
            console.error(err);
        }
    };

    return (
        <div>
            <RegisterComponent
                lab={lab}
                setLab={setLab}
                handleRegister={handleRegister}
                registerError={registerError}
            />

            <Toast
                className="register-toast"
                animation={true}
                show={showRegisterToast}
                onClose={() => setShowRegisterToast(false)}
            >
                <Toast.Header>
                    <strong className="mr-auto">Success!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>Your request has been successfully submitted!</Toast.Body>
            </Toast>
        </div>
    );
}

export default RegisterContainer;
