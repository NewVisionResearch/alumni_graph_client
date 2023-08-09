import { Form, Button, Row, Col } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';

function RegisterComponent({ lab, setLab, handleRegister, registerError }) {

    return (
        <>
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
                    e.preventDefault();
                    handleRegister(lab);
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
                            type="text"
                            name="labUrl"
                            placeholder="www.example.com"
                            required
                            value={lab.labUrl}
                            onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                        />
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
                <Form.Text className="text-danger">{registerError}</Form.Text>
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
        </>
    );
}

export default RegisterComponent;
