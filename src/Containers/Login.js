import { useState } from "react"
import { Button, Form, InputGroup } from 'react-bootstrap'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'

function Login({ login, error }) {

    const [admin, setAdmin] = useState({ username: "", password: "" })
    const [viewPassword, setViewPassword] = useState(false)

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
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password: </Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={viewPassword ? "text" : "password"}
                            name="password"
                            value={admin.password}
                            onChange={({ target: { name, value } }) => setAdmin({ ...admin, [name]: value })}
                        />
                        <InputGroup.Append>
                            <Button
                                variant="secondary"
                                onClick={() => setViewPassword(!viewPassword)}
                            >{viewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-danger">{error}</Form.Text>
                </Form.Group>
                <Button type="submit">Login</Button>
            </Form>
        </div>
    )
}

export default Login
