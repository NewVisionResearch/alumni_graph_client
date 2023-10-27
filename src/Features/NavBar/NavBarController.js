import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../Context/AdminContext/AdminContext";
import NavBarContainer from "./NavBarContainer";
import { getAdminStatus, getAdmins } from "../../services/api";
import { ToastContext } from "../../Context/ToastContext/ToastContext";

function NavBarController({ logout }) {
    const admin = useContext(AdminContext);
    const showToast = useContext(ToastContext);

    const [isSysAdmin, setIsSysAdmin] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

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

    const handleGetAdminsClick = async () => {
        setIsExporting(true);

        try {
            const response = await getAdmins();

            if (response.ok) {
                showToast({
                    header: "Export Success!",
                    body: "The export has been sent to your email!",
                });
            } else {
                showToast({
                    header: "Export Error",
                    body: "There has been an error.",
                });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <NavBarContainer
            isExporting={isExporting}
            isSysAdmin={isSysAdmin}
            labId={admin.labId}
            handleGetAdminsClick={handleGetAdminsClick}
            logout={logout}
        />
    );
}

export default NavBarController;
