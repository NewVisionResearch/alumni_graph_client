import { useState } from "react";
import { Button, Form, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Register({ register, error }) {

    let navigate = useNavigate();

    const [lab, setLab] = useState({ email: "", name: "", labName: "", phoneNumber: "", howToUse: "", labUrl: "" });
    const [showRegisterToast, setShowRegisterToast] = useState(false);

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleHomeClick = () => {
        navigate("/");
    };

    return (
        <div
            className="login d-flex flex-column justify-content-center align-items-center pt-3"
            style={{ width: '100%' }}>
            <div
                className="d-flex flex-column justify-content-center align-items-center pb-3">
                <p
                    style={{ fontSize: '1.25em', width: '75%' }}>
                    Thank you for your interest in using this program,<br />
                    please submit the following information to be considered for approval:
                </p>
            </div>
            <Form
                onSubmit={(e) => {
                    register(e, lab, setShowRegisterToast, setLab);
                }}
                style={{ width: '25%' }}>
                <Form.Group>
                    <Form.Label>Email: </Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        required
                        value={lab.email}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name: </Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        required
                        value={lab.name}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Lab/Institution Name: </Form.Label>
                    <Form.Control
                        type="text"
                        name="labName"
                        placeholder="Enter lab/institution name"
                        required
                        value={lab.labName}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone Number: </Form.Label>
                    <Form.Control
                        type="tel"
                        name="phoneNumber"
                        placeholder="123-456-7890"
                        required
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        value={lab.phoneNumber}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Lab Url: </Form.Label>
                    <Form.Control
                        type="url"
                        name="labUrl"
                        placeholder="http://www.example.com"
                        required
                        value={lab.url}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>How do you plan on using this tool? </Form.Label>
                    <Form.Control
                        type="text"
                        name="howToUse"
                        placeholder="Enter reason"
                        required
                        value={lab.howToUse}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Text className="text-danger">{error}</Form.Text>
                <div style={{
                    display: "flex",
                    "alignItems": "center",
                    "flexWrap": "wrap",
                    "flexDirection": "row",
                    "justifyContent": "space-between",
                    gap: 20
                }}>
                    <Button style={{ marginTop: 5 }} type="submit">Submit</Button>
                    <div style={{
                        display: "flex",
                        'flexDirection': "row",
                        'alignContent': "center",
                        'alignItems': "center",
                        'flexWrap': "wrap",
                        'justifyContent': "flex-start"
                    }}
                    >Already registered?&nbsp;<Button style={{ padding: 0 }} onClick={handleLoginClick} variant="link"> Login!</Button></div>
                </div>
            </Form>
            <Button
                style={{
                    position: 'absolute',
                    right: 30,
                    top: 30,
                    height: 'fit-content',
                    zIndex: 1000,
                    border: '1px solid black',
                    borderRadius: '.25rem',
                    boxShadow: '-1px 1px 10px rgb(31, 31, 31)'
                }}
                value="Home"
                onClick={handleHomeClick}
            >Home</Button>
            <Toast
                style={{
                    position: 'absolute',
                    top: 10,
                    backgroundColor: "green"
                }}
                animation={true}
                show={showRegisterToast}
                onClose={() => setShowRegisterToast(false)}>
                <Toast.Header>
                    <strong className="mr-auto">Success!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>
                    Your request has been successfully submitted!
                </Toast.Body>
            </Toast>
        </div>
    );
}

export default Register;
