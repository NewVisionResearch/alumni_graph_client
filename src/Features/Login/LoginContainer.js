import {
    Button,
    Form,
    Toast,
    InputGroup,
    Container,
    Row,
    Col,
    ButtonToolbar,
    ButtonGroup,
    Spinner,
} from "react-bootstrap";
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
    showPasswordResetSuccessfulToast,
    setShowPasswordResetSuccessfulToast,
    clearLoginError,
    isLoggingIn,
}) {
    return (
        <div>
            <Container>
                <Row className="justify-content-md-center">
                    <Col className="login" lg={5}>
                        <h1 className="text-center m-1">Login</h1>
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin(admin);
                            }}
                        >
                            <Form.Group>
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
                            <Form.Group>
                                <Form.Label>Password: </Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={
                                            viewPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Password"
                                        required
                                        value={admin.password}
                                        onChange={({
                                            target: { name, value },
                                        }) => {
                                            clearLoginError();
                                            setAdmin({
                                                ...admin,
                                                [name]: value,
                                            });
                                        }}
                                    />
                                    <InputGroup.Append>
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
                                    </InputGroup.Append>
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
            <Toast
                className="login-toast"
                animation={true}
                show={showPasswordResetSuccessfulToast}
                onClose={() => setShowPasswordResetSuccessfulToast(false)}
            >
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

export default LoginContainer;
