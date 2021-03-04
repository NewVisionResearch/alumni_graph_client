import { Nav } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
function NavBar() {
    return (
        <Nav className="d-flex">
            <Nav.Item>
                <Link to="/">Graph</Link>
            </Nav.Item>
            <Nav.Item>
                <Link to="/Dashboard">Dashboard</Link>
            </Nav.Item>
        </Nav>
    )
}

export default withRouter(NavBar)