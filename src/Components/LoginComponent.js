import { Button, Form, Toast, InputGroup } from "react-bootstrap";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

function LoginComponent({
    admin,
    setAdmin,
    viewPassword,
    setViewPassword,
    handleLogin,
    handleResetPasswordClick,
    loginError,
    showPasswordResetSuccessfulToast,
    setShowPasswordResetSuccessfulToast,
    clearLoginError
}) {
    return (
        <div
            className="login d-flex flex-column justify-content-center align-items-center pt-5"
            style={{ width: "100%" }}
        >
            <div className="d-flex flex-column justify-content-center align-items-center pb-2">
                <h1 style={{ fontSize: "1.25em" }}>Login</h1>
            </div>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin(admin);
                }}
                style={{ width: "25%", height: "35%" }}
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
                        }
                        }
                    />
                </Form.Group>
                <Form.Group>
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
                                setAdmin({ ...admin, [name]: value });
                            }
                            }
                        />
                        <InputGroup.Append>
                            <Button
                                variant="secondary"
                                onClick={() => setViewPassword(!viewPassword)}
                            >
                                {viewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-danger">{loginError}</Form.Text>
                </Form.Group>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 20,
                    }}
                >
                    <Button type="submit">Login</Button>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Button
                            style={{ padding: 0 }}
                            onClick={handleResetPasswordClick}
                            variant="link"
                        >
                            Forgot password? Reset!
                        </Button>
                    </div>
                </div>
            </Form>
            <Toast
                style={{
                    position: "absolute",
                    top: 10,
                    backgroundColor: "green",
                }}
                animation={true}
                show={showPasswordResetSuccessfulToast}
                onClose={() => setShowPasswordResetSuccessfulToast(false)}
            >
                <Toast.Header>
                    <strong className="mr-auto">Success!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>Your password has been successfully reset!</Toast.Body>
            </Toast>
        </div>
    );
}

export default LoginComponent;
