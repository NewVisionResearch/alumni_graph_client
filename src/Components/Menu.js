import { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { AdminContext } from '../Context/Context';

import '../styles/Menu.css';

function Menu({ show }) {
    let navigate = useNavigate();

    const admin = useContext(AdminContext);


    return (
        <Dropdown className='menu-dropdown' style={{
            display: show ? "block" : "none"
        }}>
            <Dropdown.Toggle className='button' id="dropdown-basic">
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