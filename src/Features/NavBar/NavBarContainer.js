import { Navbar, Nav, Toast } from "react-bootstrap";

import "./styles/NavBar.css";

function NavBarContainer({
    isSysAdmin,
    labId,
    showGetAdminsQueryErrorToast,
    showGetAdminsQuerySuccessfulToast,
    setShowGetAdminsQueryErrorToast,
    setShowGetAdminsQuerySuccessfulToast,
    handleGetAdminsClick,
    logout,
}) {
    return (
        <div>
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
            <Toast
                className="nav-bar-error-toast"
                animation={true}
                show={showGetAdminsQueryErrorToast}
                onClose={() => setShowGetAdminsQueryErrorToast(false)}
            >
                <Toast.Header>
                    <strong className="mr-auto">Error</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>There has been an error.</Toast.Body>
            </Toast>
            <Toast
                className="nav-bar-success-toast"
                animation={true}
                show={showGetAdminsQuerySuccessfulToast}
                onClose={() => setShowGetAdminsQuerySuccessfulToast(false)}
            >
                <Toast.Header>
                    <strong className="mr-auto">Success!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>
                    The query has been successfully sent to your email!
                </Toast.Body>
            </Toast>
        </div>
    );
}

export default NavBarContainer;
