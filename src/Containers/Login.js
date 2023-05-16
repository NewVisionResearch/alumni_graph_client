import { useState } from "react";
import { Button, Form, Toast, InputGroup } from 'react-bootstrap';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function Login({ login, error, showPasswordResetSuccessfulToast, setShowPasswordResetSuccessfulToast }) {

  let navigate = useNavigate();

  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [viewPassword, setViewPassword] = useState(false);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div
      className="login d-flex justify-content-center align-items-center"
      style={{ width: '100%', height: '100%' }}>
      <Form
        onSubmit={(e) => {
          setAdmin({ email: "", password: "" });
          login(e, admin);
        }}
        style={{ width: '25%', height: '35%' }}>
        <Form.Group>
          <Form.Label>Email: </Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            required
            value={admin.email}
            onChange={({ target: { name, value } }) => setAdmin({ ...admin, [name]: value })}
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
        <div style={{
          display: "flex",
          "alignItems": "center",
          "flexWrap": "wrap",
          "flexDirection": "row",
          "justifyContent": "space-between",
          gap: 20
        }}>
          <Button type="submit">Login</Button>
          <div style={{
            display: "flex",
            'flexDirection': "row",
            'alignContent': "center",
            'alignItems': "center",
            'flexWrap': "wrap",
            'justifyContent': "flex-start"
          }}
          >Not registered?&nbsp;<Button style={{ padding: 0 }} onClick={handleRegisterClick} variant="link"> Sign up!</Button></div>
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
        show={showPasswordResetSuccessfulToast}
        onClose={() => setShowPasswordResetSuccessfulToast(false)}>
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

export default Login;
