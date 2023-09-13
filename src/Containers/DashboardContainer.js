import { useCallback, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import DashboardComponent from "../Components/DashboardComponent";
import { deleteAlumn, fetchAlumnsIndex } from "../services/api";
import { AdminContext } from "../Context/Context";

function DashboardContainer() {
    const [alumns, setAlumns] = useState([]);
    const [alumnShowIdAndName, setAlumnShowIdAndName] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [isAlumnListLoading, setIsAlumnListLoading] = useState(true);
    const [progressMap, setProgressMap] = useState(new Map());

    const admin = useContext(AdminContext);

    const navigate = useRef(useNavigate());

    const openAlumnShow = (alumn_id, full_name) => {
        setAlumnShowIdAndName({ alumn_id, full_name });
    };

    const handleDeleteAlumn = async (alumn_id) => {
        try {
            const res = await deleteAlumn(alumn_id);

            if (!res.ok) throw res;

            setAlumns((prevAlumns) =>
                prevAlumns.filter((alumn) => alumn.alumn_id !== alumn_id)
            );
            setAlumnShowIdAndName(null);
        } catch (error) {
            throw error;
        }
    };

    const handleInfoClick = () => {
        setShowInfoModal((prev) => !prev);
    };

    const handleAlumnsChange = useCallback(
        (alumnsLength) => {
            if (alumnsLength > 0) {
                setShowInfoModal(false);
            } else if (alumnsLength === 0 && !isAlumnListLoading) {
                setShowInfoModal(true);
            }
        },
        [isAlumnListLoading]
    );

    const memoizedAlumnFetch = useCallback(async () => {
        setIsAlumnListLoading(true);

        try {
            const res = await fetchAlumnsIndex(admin.labId);

            if (!res.ok) {
                throw res;
            }
            const alumnsArray = await res.json();

            return setAlumns([...alumnsArray]);
        } catch (res) {
            console.error(res);
            navigate.current("/error");
        } finally {
            setIsAlumnListLoading(false);
        }
    }, [admin.labId]);

    // fetch alumns when alumns or admin changes
    useEffect(() => {
        if (admin.labId !== "") {
            memoizedAlumnFetch();
        }
    }, [admin.labId, memoizedAlumnFetch]);

    useEffect(() => {
        handleAlumnsChange(alumns.length);
    }, [alumns.length, handleAlumnsChange]);

    return (
        <DashboardComponent
            showInfoModal={showInfoModal}
            setShowInfoModal={setShowInfoModal}
            openAlumnShow={openAlumnShow}
            handleInfoClick={handleInfoClick}
            handleDeleteAlumn={handleDeleteAlumn}
            alumns={alumns}
            setAlumns={setAlumns}
            alumnShowIdAndName={alumnShowIdAndName}
            isAlumnListLoading={isAlumnListLoading}
            progressMap={progressMap}
            setProgressMap={setProgressMap}
        />
    );
}

export default DashboardContainer;
