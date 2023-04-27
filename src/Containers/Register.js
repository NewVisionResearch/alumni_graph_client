import { useState } from "react"
import { Button, Form, Toast } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function Register({register, error}) {

    let navigate = useNavigate()

    const [lab, setLab] = useState({email: "", username: "", labName: "" })
    const [showRegisterToast, setShowRegisterToast] = useState(false)

    const handleLoginClick = () => {
        navigate("/login")
    }

    const handleHomeClick = () => {
        navigate("/");
    }

    return (
        <div
            className="login d-flex flex-column justify-content-center align-items-center pt-5"
            style={{ width: '100%'}}>
            <div
                className="d-flex flex-column justify-content-center align-items-center pb-5">
                <p
                    style={{fontSize: '1.25em', width: '75%'}}>
                    "Thank you for your interest in creating an account on our platform.
                    To ensure the security and quality of our service, we require all new users to be verified by a member of our team.
                    To begin the account creation process, please enter your email address below.
                    We will send you a verification code that you can use to complete the registration process.
                    Please note that submitting a request does not guarantee account activation.
                    Our team will review your request and get back to you as soon as possible.
                    Thank you for your patience!"
                </p>
                <p
                    style={{fontSize: '1.25em'}}>
                    - New Vision Research
                </p>
            </div>
            <Form
                onSubmit={(e) => {
                    register(e, lab, setShowRegisterToast, setLab)
                }}
                style={{ width: '25%'}}>
                <Form.Group>
                    <Form.Label>Email: </Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        required
                        value={lab.email}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Username: </Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        required
                        value={lab.username}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Lab Name: </Form.Label>
                    <Form.Control
                        type="text"
                        name="labName"
                        placeholder="Enter lab name"
                        required
                        value={lab.labName}
                        onChange={({ target: { name, value } }) => setLab({ ...lab, [name]: value })}
                    />
                </Form.Group>
                <Form.Text className="text-danger">{error}</Form.Text>
                <div style={{
                    display: "flex",
                    "align-items": "center",
                    "flex-wrap": "wrap",
                    "flex-direction": "row",
                    "justify-content": "space-between",
                    gap: 20
                }}>
                    <Button style={{ marginTop: 5 }} type="submit">Submit</Button>
                    <div style={{
                        display: "flex", 
                        'flex-direction': "row", 
                        'align-content': "center", 
                        'align-items': "center", 
                        'flex-wrap': "wrap", 
                        'justify-content': "flex-start"                        
                    }}
                    >Already registered?&nbsp;<Button style={{padding: 0}} onClick={handleLoginClick} variant="link"> Login!</Button></div>
                </div>
            </Form>
            <Button
            style={{
                position: 'absolute',
                right: 30,
                top: 30,
                height: 'fit-content',
                zIndex: 1000,
                border: '1px solid black',
                borderRadius: '.25rem',
                boxShadow: '-1px 1px 10px rgb(31, 31, 31)'
              }}
              value="Home"
              onClick={handleHomeClick}
              >Home</Button>
            <Toast 
                style={{
                    position: 'absolute',
                    top: 10,
                    backgroundColor: "green"
                }}
                animation={true}
                show={showRegisterToast} 
                onClose={() => setShowRegisterToast(false)}>
                <Toast.Header>
                    <strong className="mr-auto">Success!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>
                    Your request has been successfully submitted!
                </Toast.Body>
            </Toast>
        </div>
    )
}

export default Register;
