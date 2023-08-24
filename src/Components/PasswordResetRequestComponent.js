import { Button, Form, InputGroup } from "react-bootstrap";

function PasswordResetRequestComponent({ email, setEmail, handleSubmitClick }) {
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center pb-2">
                <h1 style={{ fontSize: "1.25em" }}>Password Reset Request</h1>
            </div>
            <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitClick();
            }} style={{ width: "25%" }}>
                <Form.Group>
                    <Form.Label>Email: </Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required
                            value={email}
                            onChange={({ target: { value } }) => setEmail(value)}
                        />
                    </InputGroup>
                </Form.Group>
                <Button style={{ marginTop: 5 }} type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );
}

export default PasswordResetRequestComponent;
