import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

function PasswordResetRequestContainer({ email, setEmail, handleSubmitClick }) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="password-reset-request" lg={6}>
                    <h1 className="text-center m-1">Password Reset Request</h1>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitClick();
                        }}
                    >
                        <Form.Group>
                            <Form.Label>Email: </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    required
                                    value={email}
                                    onChange={({ target: { value } }) =>
                                        setEmail(value)
                                    }
                                />
                            </InputGroup>
                        </Form.Group>
                        <Button className="button m-2" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default PasswordResetRequestContainer;
