import { Nav } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
function NavBar({ logout }) {

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