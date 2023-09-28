import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import PhoneInput from "react-phone-number-input";

import CustomPhoneInput from "./CustomPhoneInput/CustomPhoneInput";

import "./styles/Register.css";
import "react-phone-number-input/style.css";

function RegisterContainer({
    lab,
    setLab,
    handleRegister,
    registerError,
    isRegistering,
}) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="register" lg={6}>
                    <h1 className="custom-h1">Register</h1>
                    <h5 className="text-center m-3">
                        Thank you for your interest in using this program,
                        <br />
                        please submit the following information to be considered
                        for approval:
                    </h5>

                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister(lab);
                        }}
                    >
                        <Form.Group as={Row} className="custom-form-group">
                            <Form.Label column sm={4}>
                                Email:{" "}
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    required
                                    value={lab.email}
                                    onChange={({ target: { name, value } }) =>
                                        setLab({ ...lab, [name]: value })
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="custom-form-group">
                            <Form.Label column sm={4}>
                                Name:{" "}
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    required
                                    value={lab.name}
                                    onChange={({ target: { name, value } }) =>
                                        setLab({ ...lab, [name]: value })
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="custom-form-group">
                            <Form.Label column sm={4}>
                                Lab/Institution Name:{" "}
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="labName"
                                    placeholder="Enter lab/institution name"
                                    required
                                    value={lab.labName}
                                    onChange={({ target: { name, value } }) =>
                                        setLab({ ...lab, [name]: value })
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="custom-form-group">
                            <Form.Label column sm={4}>
                                Phone Number:{" "}
                            </Form.Label>
                            <Col sm={8}>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={false}
                                    defaultCountry="US"
                                    placeholder="Enter phone number"
                                    value={lab.phoneNumber}
                                    onChange={(value) =>
                                        setLab({ ...lab, phoneNumber: value })
                                    }
                                    inputComponent={CustomPhoneInput}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="custom-form-group">
                            <Form.Label column sm={4}>
                                Lab Url:{" "}
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="labUrl"
                                    placeholder="www.example.com"
                                    required
                                    value={lab.labUrl}
                                    onChange={({ target: { name, value } }) =>
                                        setLab({ ...lab, [name]: value })
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="custom-form-group">
                            <Form.Label column sm={4}>
                                How do you plan on using this tool?{" "}
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="howToUse"
                                    placeholder="Enter reason (250 character max)"
                                    required
                                    maxLength={250}
                                    value={lab.howToUse}
                                    onChange={({ target: { name, value } }) =>
                                        setLab({ ...lab, [name]: value })
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Text className="text-danger">
                            {registerError}
                        </Form.Text>

                        <Button className="button m-2" type="submit">
                            {isRegistering ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    {" Submitting..."}
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterContainer;
