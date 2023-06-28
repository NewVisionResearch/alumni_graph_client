import { useState } from "react";
import { Button, Form, Toast, Row, Col } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Menu from "./Menu";

function Register({ register, error }) {
    const [lab, setLab] = useState({ email: "", name: "", labName: "", phoneNumber: "", howToUse: "", labUrl: "" });
    const [showRegisterToast, setShowRegisterToast] = useState(false);

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
            >
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>Email: </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required
                            value={lab.email}
                            onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>Name: </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            required
                            value={lab.name}
                            onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>Lab/Institution Name: </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            name="labName"
                            placeholder="Enter lab/institution name"
                            required
                            value={lab.labName}
                            onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>Phone Number: </Form.Label>
                    <Col sm={8}>
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="US"
                            placeholder="Enter phone number"
                            value={lab.phoneNumber}
                            onChange={(value) => setLab({ ...lab, phoneNumber: value })}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>Lab Url: </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="url"
                            name="labUrl"
                            placeholder="http(s)://www.example.com"
                            required
                            value={lab.url}
                            onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                        />
                        <Form.Text>Please enter the full Url. Ex: "http(s)://www.example.com"</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>How do you plan on using this tool? </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            name="howToUse"
                            placeholder="Enter reason (250 character max)"
                            required
                            maxLength={250}
                            value={lab.howToUse}
                            onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                        />
                    </Col>
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
                </div>
            </Form>
            <Menu show={true}></Menu>
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
