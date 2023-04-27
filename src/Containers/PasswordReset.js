import { useState } from "react"
import { Button, Form, Toast, InputGroup } from 'react-bootstrap'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router-dom'
import PasswordChecklist from "react-password-checklist"

function PasswordReset({setShowPasswordResetSuccessfulToast}) {

    let { token } = useParams();

    let navigate = useNavigate()

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const [passwordResetError, setPasswordResetError] = useState("");
    const [showPasswordResetErrorToast, setShowPasswordResetErrorToast] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

    const baseUrl = process.env.REACT_APP_BASE_URL

    const handleSubmitClick = (e) => {
        e.preventDefault();

        if( password === confirmPassword){
            setIsInvalid(false);

            let passwordObj = {
                password_reset: {
                    password_digest: password
                }
            }
      
            let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(passwordObj)
            }
    
            fetch(`${baseUrl}/password-reset/${token}/update`, options)
                .then(res => {
                    setShowPasswordResetErrorToast(false);
                    setPasswordResetError("")
                    if (!res.ok) { throw res }
                    return res.json()
                })
                .then((request) => {
                    setPassword("");
                    setConfirmPassword("");
                    setShowPasswordResetSuccessfulToast(true)
                    navigate('/login')
                })
                .catch((res) => res.json())
                .then((err) => {
                    setShowPasswordResetErrorToast(true);
                    setPasswordResetError(err.errors);
                })
        }
        else{
            setIsInvalid(true);
        }
    }

    return (
        <div
            className="login d-flex flex-column justify-content-center align-items-center pt-5"
            style={{ width: '100%'}}>
            <div
                className="d-flex flex-column justify-content-center align-items-center pb-2">
                <h1
                    style={{fontSize: '1.25em'}}>
                    Password Reset
                </h1>
            </div>
            <Form
                onSubmit={(e) => handleSubmitClick(e)}
                style={{ width: '25%'}}>
                <Form.Group>
                <PasswordChecklist
                    rules={["minLength","specialChar","number","capital","match"]}
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
                            >{viewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
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
                            onChange={({ target: { value } }) => setConfirmPassword(value )}
                        />
                        <InputGroup.Append>
                            <Button
                                variant="secondary"
                                onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                            >{viewConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
                <Button disabled={isInvalid} style={{ marginTop: 5 }} type="submit">Submit</Button>
            </Form>
            <Toast 
                style={{
                    position: 'absolute',
                    top: 10,
                    backgroundColor: "red"
                }}
                animation={true}
                show={showPasswordResetErrorToast} 
                onClose={() => setShowPasswordResetErrorToast(false)}>
                <Toast.Header>
                    <strong className="mr-auto">Error</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>
                    {passwordResetError}
                </Toast.Body>
            </Toast>
        </div>
    )
}

export default PasswordReset;
