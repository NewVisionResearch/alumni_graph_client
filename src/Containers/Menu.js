import { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../Context/Context';

function Menu({ show }) {
    let navigate = useNavigate();

    const admin = useContext(AdminContext);


    return (
        <Dropdown style={{
            position: 'absolute',
            right: 30,
            top: 30,
            height: 'fit-content',
            zIndex: 500,
            borderRadius: '.25rem',
            boxShadow: '-1px 1px 10px rgb(31, 31, 31)',
            display: show ? "block" : "none"
        }}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate(`/graph/${admin.labId}`)}>Home</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/login')}>Login</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/register')}>Register</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/password-reset-request')}>Password Reset</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Menu;