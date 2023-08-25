import { Image, Nav, Toast } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBarComponent({ isSysAdmin, labId, showGetAdminsQueryErrorToast, showGetAdminsQuerySuccessfulToast, setShowGetAdminsQueryErrorToast, setShowGetAdminsQuerySuccessfulToast, handleGetAdminsClick, logout }) {
    return (
        <div
            className="d-flex justify-content-center align-items-center border-bottom border-secondary"
            style={{ position: "relative", width: "100%", height: "75px" }}
        >
            <Nav
                className="d-flex justify-content-between"
                style={{ position: "absolute", top: 0, width: "85%", height: "100%" }}
            >
                <Nav.Item
                    className="nav-item"
                    style={{ padding: "0.5rem 0", width: "5rem" }}
                >
                    <Link reloadDocument to={"https://newvisionresearch.org"}>
                        <Image style={{ width: "100%" }} src="../NVR1-TC.png" rounded />
                    </Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link reloadDocument to={`/graph/${labId}`}>
                        Graph
                    </Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link to="/dashboard">Dashboard</Link>
                </Nav.Item>
                {isSysAdmin ? (
                    <Nav.Item className="nav-item">
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                handleGetAdminsClick();
                            }}
                        >
                            Get Admins
                        </Link>
                    </Nav.Item>
                ) : (
                    <></>
                )}
                <Nav.Item className="nav-item" onClick={() => logout()}>
                    <Link to="#">Logout</Link>
                </Nav.Item>
            </Nav>
            <Toast
                style={{
                    position: "absolute",
                    top: 10,
                    backgroundColor: "red",
                }}
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
                style={{
                    position: "absolute",
                    top: 10,
                    backgroundColor: "green",
                }}
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

export default NavBarComponent;
