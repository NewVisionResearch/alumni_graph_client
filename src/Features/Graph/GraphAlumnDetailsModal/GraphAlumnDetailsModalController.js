import { useState, useEffect } from "react";
import CloseButton from "react-bootstrap/CloseButton";

import GraphAlumnDetailsModalContainer from "./GraphAlumnDetailsModalContainer";
import Loading from "../../../Components/Loading/Loading";
import { fetchAlumnById } from "../../../services/api";

import "./styles/GraphAlumnDetailsModal.css";

function GraphAlumnDetailsModalController({ alumnId, closeModal }) {
    const [alumn, setAlumn] = useState({
        full_name: "",
        search_query: "",
        my_alumn_publications: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        setAlumn({
            full_name: "",
            search_query: "",
            my_alumn_publications: [],
        });

        const controller = new AbortController();
        const signal = controller.signal;

        fetchAlumnById(alumnId, signal)
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then((alumnObj) => {
                setAlumn(alumnObj);
                setIsLoading(false);
            })
            .catch((res) => {
                console.error(res);
                setIsLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [alumnId]);

    return (
        <div className="graph-alumn-details-modal">
            <CloseButton
                className="graph-alumn-details-modal-close-button"
                onClick={closeModal}
            />
            {isLoading ? (
                <Loading />
            ) : (
                <GraphAlumnDetailsModalContainer alumn={alumn} />
            )}
        </div>
    );
}

export default GraphAlumnDetailsModalController;
