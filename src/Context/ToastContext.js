import React, { createContext, useState, useCallback } from "react";

import ToastComponent from "../Components/ToastComponent";

import "../styles/Toast.css";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((data) => {
        const uuid = Math.random();
        setToasts((prevToasts) => [...prevToasts, { ...data, uuid }]);
    }, []);

    const handleOnClose = (uuid) => {
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((val) => val.uuid !== uuid));
        }, 2000);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="toast-context">
                {toasts.map((toastData) => (
                    <ToastComponent
                        key={toastData.uuid}
                        toastData={toastData}
                        handleOnClose={() => handleOnClose(toastData.uuid)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
