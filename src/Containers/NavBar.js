import { Nav } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
function NavBar({ logout }) {

    return (
        <div className="d-flex justify-content-center align-items-center border-bottom border-secondary" style={{ width: "100%", height: "50px" }}>
            <Nav className="d-flex justify-content-between align-items-center" style={{ width: "85%" }}>
                <div className="d-flex justify-content-between" style={{ width: "fit-content" }}>
                    <Nav.Item className="mr-4">
                        <Link to="/">Graph</Link>
                    </Nav.Item>
                    <Nav.Item className="ml-4">
                        <Link to="/Dashboard">Dashboard</Link>
                    </Nav.Item>
                </div>
                <Nav.Item onClick={() => logout()}>
                    <Link to="#">Logout</Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default withRouter(NavBar)