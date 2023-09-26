import { Navbar, Nav } from "react-bootstrap";

import "./styles/NavBar.css";

function NavBarContainer({ isSysAdmin, labId, handleGetAdminsClick, logout }) {
    return (
        <Navbar expand="sm">
            <Navbar.Brand href="https://newvisionresearch.org">
                <img
                    src="../NVR1-TC.png"
                    width="106"
                    height="76"
                    className="d-inline-block align-top"
                    alt="New Vision Research Logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    <Nav.Link href={`/graph/${labId}`}>Graph</Nav.Link>
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                    {isSysAdmin && (
                        <Nav.Link
                            onClick={(e) => {
                                e.preventDefault();
                                handleGetAdminsClick();
                            }}
                        >
                            Export Admins
                        </Nav.Link>
                    )}
                    <Nav.Link
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                        }}
                    >
                        Logout
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBarContainer;
