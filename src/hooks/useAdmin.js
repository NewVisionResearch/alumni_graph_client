import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import * as authService from "../services/authService";
import { getProfile } from "../services/api";

export default function useAdmin() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState({ email: "", labId: "" });
    const [loginError, setLoginError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const token = localStorage.getItem("jwt");

        if (token) {
            getProfile(token, signal)
                .then((res) => {
                    if (!res.ok) throw res;
                    return res.json();
                })
                .then((adminData) => setAdmin(adminData))
                .catch((err) => console.error(err));
        }

        return () => {
            controller.abort();
        };
    }, []);

    const clearLoginError = useCallback(() => {
        setLoginError("");
    }, []);

    const login = async (adminInfo) => {
        setIsLoggingIn(true);

        try {
            const res = await authService.login(adminInfo);

            if (!res.ok) throw res;

            const { email, labId, jwt } = await res.json();
            localStorage.setItem("jwt", jwt);
            setAdmin({ email, labId });
            navigate("/dashboard");
        } catch (err) {
            const { error } = await err.json();
            setLoginError(error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("jwt");
        setAdmin({ email: "", labId: "" });
        navigate("/");
    };

    return {
        admin,
        login,
        logout,
        loginError,
        clearLoginError,
        isLoggingIn,
    };
}
