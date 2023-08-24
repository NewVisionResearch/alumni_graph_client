import { Button, Form, InputGroup } from "react-bootstrap";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import PasswordChecklist from "react-password-checklist";

function PasswordResetComponent({
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
}) {
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center pb-2">
                <h1 style={{ fontSize: "1.25em" }}>Password Reset</h1>
            </div>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitClick();
                }}
                style={{ width: "25%" }}
            >
                <Form.Group>
                    <PasswordChecklist
                        rules={["minLength", "specialChar", "number", "capital", "match"]}
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
                            onChange={({ target: { value } }) => setPassword(value)}
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
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password: </Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type={viewConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={({ target: { value } }) => setConfirmPassword(value)}
                        />
                        <InputGroup.Append>
                            <Button
                                variant="secondary"
                                onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                            >
                                {viewConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
                <Button disabled={isInvalid} style={{ marginTop: 5 }} type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );
}

export default PasswordResetComponent;
