import { Toast } from "react-bootstrap";

import "../styles/Toast.css";
import { useState } from "react";

function ToastComponent({ toastData, handleOnClose }) {
    const [show, setShow] = useState(true);

    return (
        <Toast
            className="toast-component"
            animation={true}
            autohide={true}
            delay={5000}
            show={show}
            onClose={() => {
                setShow(false);
                handleOnClose();
            }}
        >
            <Toast.Header>
                <strong className="mr-auto">{toastData?.header}</strong>
                <small>now</small>
            </Toast.Header>
            <Toast.Body>{toastData?.body}</Toast.Body>
        </Toast>
    );
}

export default ToastComponent;
