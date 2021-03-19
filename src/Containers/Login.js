import { useState } from "react"
import { Button, Form } from 'react-bootstrap'

function Login({ login }) {

    const [admin, setAdmin] = useState({ username: "", password: "" })
    return (
        <div
            className="login d-flex justify-content-center align-items-center"
            style={{ width: '100%', height: '100%' }}>
            <Form
                onSubmit={(e) => {
                    setAdmin({ username: "", password: "" })
                    login(e, admin)
                }}
                style={{ width: '25%', height: '35%' }}>
                <Form.Group>
                    <Form.Label>Username: </Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={admin.username}
                        onChange={({ target: { name, value } }) => setAdmin({ ...admin, [name]: value })}
                    />
                    <Form.Text></Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password: </Form.Label>
                    <Form.Control
                        type="text"
                        name="password"
                        value={admin.password}
                        onChange={({ target: { name, value } }) => setAdmin({ ...admin, [name]: value })}
                    />
                </Form.Group>
                <Form.Text></Form.Text>
                <Button type="submit">Login</Button>
            </Form>
        </div>
    )
}

export default Login
