import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

function PasswordResetRequestContainer({
    email,
    setEmail,
    handleSubmitClick,
    passwordResetRequestError,
    isSubmittingPasswordResetRequest,
}) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="password-reset-request" lg={6}>
                    <h1 className="custom-h1">Password Reset Request</h1>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitClick();
                        }}
                    >
                        <Form.Group className="custom-form-group">
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
                            <Form.Text className="text-danger">
                                {passwordResetRequestError}
                            </Form.Text>
                        </Form.Group>
                        <Button
                            className="button m-2 mt-0"
                            type="submit"
                            disabled={isSubmittingPasswordResetRequest}
                        >
                            {isSubmittingPasswordResetRequest ? (
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

export default PasswordResetRequestContainer;
