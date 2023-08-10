// hooks/useAdmin.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import * as authService from "../services/authService";
import { getProfile } from "../services/api";

export default function useAdmin() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState({ email: "", labId: "" });
    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const token = localStorage.getItem("jwt");

        if (token) {
            getProfile(token)
                .then(res => {
                    if (!res.ok) throw res;
                    return res.json();
                })
                .then(adminData => {
                    if (isMounted) setAdmin(adminData);
                })
                .catch(err => {
                    if (isMounted) console.error(err); // or set a state error if desired
                });
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const clearLoginError = useCallback(() => {
        setLoginError("");
    }, []);

    const login = async (adminInfo) => {
        try {
            const res = await authService.login(adminInfo);

            if (!res.ok) throw res;

            const { email, labId, jwt } = await res.json();
            localStorage.setItem("jwt", jwt);
            setAdmin({ email, labId });
            navigate("/dashboard");
        } catch (err) {
            const { error } = await err.json();
            setLoginError(error); // Assuming error is in a readable format
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
        clearLoginError
    };
}
