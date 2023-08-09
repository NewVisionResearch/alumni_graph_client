import { useState } from "react";
import { Button, Form, Toast, InputGroup } from 'react-bootstrap';

function PasswordResetRequest() {
    const [email, setEmail] = useState("");
    const [passwordResetRequestError, setPasswordResetRequestError] = useState("");
    const [showPasswordResetRequestErrorToast, setShowPasswordResetRequestErrorToast] = useState(false);
    const [showPasswordResetRequestSuccessfulToast, setShowPasswordResetRequestSuccessfulToast] = useState(false);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const handleSubmitClick = (e) => {
        e.preventDefault();

        let emailObj = {
            password_reset: {
                email: email
            }
        };

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(emailObj)
        };

        fetch(`${baseUrl}/password-reset/request`, options)
            .then(res => {
                setShowPasswordResetRequestErrorToast(false);
                setPasswordResetRequestError("");
                if (!res.ok) { throw res; }
                return res.json();
            })
            .then((request) => {
                setEmail("");
                setShowPasswordResetRequestSuccessfulToast(true);
            })
            .catch((res) => res.json())
            .then((err) => {
                setShowPasswordResetRequestErrorToast(true);
                console.log(err);
                setPasswordResetRequestError(err.text);
            });
    };

    return (
        <div
            className="login d-flex flex-column justify-content-center align-items-center pt-5"
            style={{ width: '100%' }}>
            <div
                className="d-flex flex-column justify-content-center align-items-center pb-2">
                <h1
                    style={{ fontSize: '1.25em' }}>
                    Password Reset Request
                </h1>
            </div>
            <Form
                onSubmit={(e) => handleSubmitClick(e)}
                style={{ width: '25%' }}>
                <Form.Group>
                    <Form.Label>Email: </Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required
                            value={email}
                            onChange={({ target: { value } }) => setEmail(value)}
                        />
                    </InputGroup>
                </Form.Group>
                <Button style={{ marginTop: 5 }} type="submit">Submit</Button>
            </Form>
            <Toast
                style={{
                    position: 'absolute',
                    top: 10,
                    backgroundColor: "red"
                }}
                animation={true}
                show={showPasswordResetRequestErrorToast}
                onClose={() => setShowPasswordResetRequestErrorToast(false)}>
                <Toast.Header>
                    <strong className="mr-auto">Error</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>
                    {passwordResetRequestError}
                </Toast.Body>
            </Toast>
            <Toast
                style={{
                    position: 'absolute',
                    top: 10,
                    backgroundColor: "green"
                }}
                animation={true}
                show={showPasswordResetRequestSuccessfulToast}
                onClose={() => setShowPasswordResetRequestSuccessfulToast(false)}>
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

export default PasswordResetRequest;
