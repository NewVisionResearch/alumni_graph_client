import { Outlet } from "react-router-dom";

import Menu from "../../Features/Menu/Menu";
import NavBarController from "../../Features/NavBar/NavBarController";

function MainLayout({ admin, logout }) {
    return (
        <>
            {admin.email === "" ? (
                <Menu show={true} />
            ) : (
                <NavBarController logout={logout} />
            )}
            <Outlet />
        </>
    );
}

export default MainLayout;
