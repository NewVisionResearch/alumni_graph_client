import { useContext, useEffect, useState } from 'react';
import { Image, Nav, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AdminContext } from '../Context/Context';

function NavBar({ logout }) {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const admin = useContext(AdminContext);

    const [isSysAdmin, setIsSysAdmin] = useState(false);
    const [showGetAdminsQueryErrorToast, setShowGetAdminsQueryErrorToast] = useState(false);
    const [showGetAdminsQuerySuccessfulToast, setShowGetAdminsQuerySuccessfulToast] = useState(false);
    useEffect(() => {
        const fetchAdminStatus = async () => {
            try {
                const token = localStorage.getItem('jwt');

                const options = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await fetch(`${baseUrl}/admins/check_admin_status`, options);
                if (response.ok) {
                    const data = await response.json();
                    setIsSysAdmin(data);
                } else {
                    console.error('Error:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchAdminStatus();
    }, [baseUrl]);

    const handleGetAdminsClick = (e) => {
        e.preventDefault();
        const fetchAdminQuery = async () => {
            try {
                const token = localStorage.getItem('jwt');

                const options = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await fetch(`${baseUrl}/admins/get_admins`, options);
                setShowGetAdminsQueryErrorToast(false);
                if (response.ok) {
                    setShowGetAdminsQuerySuccessfulToast(true);
                } else {
                    setShowGetAdminsQueryErrorToast(true);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchAdminQuery();
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center border-bottom border-secondary"
            style={{ position: 'relative', width: "100%", height: "75px" }}>
            <Nav
                className="d-flex justify-content-between"
                style={{ position: 'absolute', top: 0, width: "85%", height: "100%" }}>
                <Nav.Item className="nav-item" style={{ padding: "0.5rem 0" }}>
                    <Image src='../NVR1-TC.png' rounded />
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link reloadDocument to={`/graph/${admin.labId}`}>Graph</Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Link to="/dashboard">Dashboard</Link>
                </Nav.Item>
                {isSysAdmin ? (
                    <Nav.Item className="nav-item">
                        <Link onClick={(e) => handleGetAdminsClick(e)}>
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
                    position: 'absolute',
                    top: 10,
                    backgroundColor: "red"
                }}
                animation={true}
                show={showGetAdminsQueryErrorToast}
                onClose={() => setShowGetAdminsQueryErrorToast(false)}>
                <Toast.Header>
                    <strong className="mr-auto">Error</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>
                    There has been an error.
                </Toast.Body>
            </Toast>
            <Toast
                style={{
                    position: 'absolute',
                    top: 10,
                    backgroundColor: "green"
                }}
                animation={true}
                show={showGetAdminsQuerySuccessfulToast}
                onClose={() => setShowGetAdminsQuerySuccessfulToast(false)}>
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

export default NavBar;;