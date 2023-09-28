import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import PasswordChecklist from "react-password-checklist";

function PasswordResetContainer({
    password,
    confirmPassword,
    viewPassword,
    viewConfirmPassword,
    isInvalid,
    setPassword,
    setConfirmPassword,
    setViewPassword,
    setViewConfirmPassword,
    setIsInvalid,
    handleSubmitClick,
    passwordResetErrors,
    isSubmittingPasswordReset,
}) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="password-reset" lg={6}>
                    <h1 className="custom-h1">Password Reset</h1>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitClick();
                        }}
                    >
                        <Form.Group className="custom-form-group">
                            <PasswordChecklist
                                rules={[
                                    "minLength",
                                    "specialChar",
                                    "number",
                                    "capital",
                                    "match",
                                ]}
                                minLength={8}
                                value={password}
                                valueAgain={confirmPassword}
                                onChange={(isValid) => setIsInvalid(!isValid)}
                                className="pb-3"
                            />
                            <Form.Label>Password: </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={viewPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={({ target: { value } }) =>
                                        setPassword(value)
                                    }
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        setViewPassword(!viewPassword)
                                    }
                                >
                                    {viewPassword ? (
                                        <AiFillEyeInvisible />
                                    ) : (
                                        <AiFillEye />
                                    )}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="custom-form-group">
                            <Form.Label>Confirm Password: </Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type={
                                        viewConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={({ target: { value } }) =>
                                        setConfirmPassword(value)
                                    }
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        setViewConfirmPassword(
                                            !viewConfirmPassword
                                        )
                                    }
                                >
                                    {viewConfirmPassword ? (
                                        <AiFillEyeInvisible />
                                    ) : (
                                        <AiFillEye />
                                    )}
                                </Button>
                            </InputGroup>
                            {passwordResetErrors ? (
                                passwordResetErrors.map((val) => (
                                    <Form.Text className="text-danger m-1">
                                        {val}
                                    </Form.Text>
                                ))
                            ) : (
                                <></>
                            )}
                        </Form.Group>
                        <Button
                            disabled={isInvalid || isSubmittingPasswordReset}
                            className="button m-2"
                            type="submit"
                        >
                            {isSubmittingPasswordReset ? (
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

export default PasswordResetContainer;
