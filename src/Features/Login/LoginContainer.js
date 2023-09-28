import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import "./styles/Login.css";

function LoginContainer({
    admin,
    setAdmin,
    viewPassword,
    setViewPassword,
    handleLogin,
    handleResetPasswordClick,
    loginError,
    clearLoginError,
    isLoggingIn,
}) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="login" lg={5}>
                    <h1 className="custom-h1">Login</h1>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin(admin);
                        }}
                    >
                        <Form.Group className="custom-form-group">
                            <Form.Label>Email: </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                required
                                value={admin.email}
                                onChange={({ target: { name, value } }) => {
                                    clearLoginError();
                                    setAdmin({ ...admin, [name]: value });
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="custom-form-group">
                            <Form.Label>Password: </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={viewPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={admin.password}
                                    onChange={({ target: { name, value } }) => {
                                        clearLoginError();
                                        setAdmin({
                                            ...admin,
                                            [name]: value,
                                        });
                                    }}
                                />
                                <Button
                                    variant="secondary"
                                    type="button"
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
                            <Form.Text className="text-danger">
                                {loginError}
                            </Form.Text>
                        </Form.Group>
                        <ButtonToolbar className="m-2 justify-content-between">
                            <ButtonGroup>
                                <Button className="button" type="submit">
                                    {isLoggingIn ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            {" Logging In..."}
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button
                                    className="link"
                                    variant="link"
                                    onClick={handleResetPasswordClick}
                                >
                                    Forgot password? Reset!
                                </Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginContainer;
