import { Nav } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
function NavBar({ logout }) {

    return (
        <div
            className="d-flex justify-content-center align-items-center border-bottom border-secondary"
            style={{ position: 'relative', width: "100%", height: "50px" }}>
            <Nav
                className="d-flex justify-content-between"
                style={{ position: 'absolute', top: 0, width: "85%", height: "100%" }}>
                <div
                    className="d-flex justify-content-between"
                    style={{ width: "fit-content", height: "100%" }}>
                    <Nav.Item className="nav-item mr-4">
                        <Link to="/">Graph</Link>
                    </Nav.Item>
                    <Nav.Item className="nav-item ml-4">
                        <Link to="/Dashboard">Dashboard</Link>
                    </Nav.Item>
                </div>
                <Nav.Item className="nav-item" onClick={() => logout()}>
                    <Link to="#">Logout</Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default withRouter(NavBar)