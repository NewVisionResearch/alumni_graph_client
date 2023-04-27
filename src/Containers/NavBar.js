import { useContext } from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AdminContext } from '../Context/Context'

function NavBar({ logout }) {

    const admin = useContext(AdminContext)

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
                        <Link reloadDocument to={`/graph/${admin.labId}`}>Graph</Link>
                    </Nav.Item>
                    <Nav.Item className="nav-item ml-4">
                        <Link to="/dashboard">Dashboard</Link>
                    </Nav.Item>
                </div>
                <Nav.Item className="nav-item" onClick={() => logout()}>
                    <Link to="#">Logout</Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default NavBar