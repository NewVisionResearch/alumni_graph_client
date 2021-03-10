import { Nav } from 'react-bootstrap'
import { Link, withRouter, useHistory } from 'react-router-dom'
function NavBar() {

    const history = useHistory()

    function logout() {
        return Promise.resolve().then(() => localStorage.removeItem("jwt")).then(() => history.push("/"))

    }

    const removeToken = () => {
        localStorage.removeItem("jwt")
    }

    return (
        <Nav className="d-flex">
            <Nav.Item>
                <Link to="/">Graph</Link>
            </Nav.Item>
            <Nav.Item>
                <Link to="/Dashboard">Dashboard</Link>
            </Nav.Item>
            <Nav.Item onClick={() => logout()}>
                <Link to="#">Logout</Link>
            </Nav.Item>
        </Nav>
    )
}

export default withRouter(NavBar)