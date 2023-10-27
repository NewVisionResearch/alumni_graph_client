import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import "./styles/NavBar.css";

function NavBarContainer({
    isExporting,
    isSysAdmin,
    labId,
    handleGetAdminsClick,
    logout,
}) {
    return (
        <Navbar expand="md">
            <Container fluid>
                <Navbar.Brand href="https://newvisionresearch.org">
                    <img
                        src="../NVR1-TC.png"
                        width="101"
                        height="76"
                        className="d-inline-block align-top"
                        alt="New Vision Research Logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href={`/graph/${labId}`}>Graph</Nav.Link>
                        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        {isSysAdmin && (
                            <Nav.Link
                                disabled={isExporting}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleGetAdminsClick();
                                }}
                            >
                                {isExporting ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        {" Exporting..."}
                                    </>
                                ) : (
                                    "Export Admins"
                                )}
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
            </Container>
        </Navbar>
    );
}

export default NavBarContainer;
