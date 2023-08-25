import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../Context/Context";
import NavBarComponent from "../Components/NavBarComponent";
import { getAdminStatus, getAdmins } from "../services/api";

function NavBarContainer({ logout }) {
    const admin = useContext(AdminContext);

    const [isSysAdmin, setIsSysAdmin] = useState(false);
    const [showGetAdminsQueryErrorToast, setShowGetAdminsQueryErrorToast] =
        useState(false);
    const [
        showGetAdminsQuerySuccessfulToast,
        setShowGetAdminsQuerySuccessfulToast,
    ] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchAdminStatus = async () => {
            try {
                const response = await getAdminStatus(signal);

                if (response.ok) {
                    const data = await response.json();
                    setIsSysAdmin(data);
                } else {
                    console.error("Error:", response.status);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchAdminStatus();

        return () => {
            controller.abort();
        };
    }, []);

    const handleGetAdminsClick = () => {
        const fetchAdminQuery = async () => {
            try {
                const response = await getAdmins();

                setShowGetAdminsQueryErrorToast(false);

                if (response.ok) {
                    setShowGetAdminsQuerySuccessfulToast(true);
                } else {
                    setShowGetAdminsQueryErrorToast(true);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchAdminQuery();
    };

    return (
        <NavBarComponent
            isSysAdmin={isSysAdmin}
            labId={admin.labId}
            showGetAdminsQueryErrorToast={showGetAdminsQueryErrorToast}
            showGetAdminsQuerySuccessfulToast={showGetAdminsQuerySuccessfulToast}
            setShowGetAdminsQueryErrorToast={setShowGetAdminsQueryErrorToast}
            setShowGetAdminsQuerySuccessfulToast={
                setShowGetAdminsQuerySuccessfulToast
            }
            handleGetAdminsClick={handleGetAdminsClick}
            logout={logout}
        />
    );
}

export default NavBarContainer;
