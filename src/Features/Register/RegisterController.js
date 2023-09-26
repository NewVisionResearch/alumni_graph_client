import React, { useContext, useState } from "react";

import RegisterContainer from "./RegisterContainer";
import { ToastContext } from "../../Context/ToastContext/ToastContext";
import * as authService from "../../services/authService";

function RegisterController() {
    const showToast = useContext(ToastContext);

    const [lab, setLab] = useState({
        email: "",
        name: "",
        labName: "",
        phoneNumber: "",
        howToUse: "",
        labUrl: "",
    });
    const [registerError, setRegisterError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegister = async (labInfo) => {
        setIsRegistering(true);
        setRegisterError("");

        try {
            const res = await authService.register(labInfo);

            if (!res.ok) throw res;

            const request = await res.json();

            // Resetting lab info after successful registration:
            setLab({
                email: "",
                name: "",
                labName: "",
                phoneNumber: "",
                howToUse: "",
                labUrl: "",
            });

            showToast({
                header: "Success!",
                body: "Your request has been submitted!",
            });

            console.log("Request: ", request);
        } catch (error) {
            const err = await error.json();
            setLab((prev) => ({ ...prev, email: "" }));
            setRegisterError(err);
            console.error(err);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <RegisterContainer
            lab={lab}
            setLab={setLab}
            handleRegister={handleRegister}
            registerError={registerError}
            isRegistering={isRegistering}
        />
    );
}

export default RegisterController;
