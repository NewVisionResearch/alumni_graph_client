import { useState, useEffect } from "react";
import { fetchAlumnById } from "../services/api";
import GraphAlumnDetailsModalComponent from "../Components/GraphAlumnDetailsModalComponent";
import Loading from "../Components/Loading";

function GraphAlumnDetailsModalContainer({ alumnId, closeModal }) {
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
        <div
            id="alumn-graph-show"
            className="mt-3 mr-3 rounded d-flex-column justify-content-center align-items-center"
            style={{
                position: "absolute",
                zIndex: 1000,
                background: "rgb(255, 255, 255)",
                boxShadow: "-7px 10px 20px rgb(31, 31, 31)",
                overflowY: "scroll",
            }}
        >
            <button
                type="button"
                className="close text-danger"
                aria-label="Close"
                style={{
                    position: "sticky",
                    top: 7,
                    right: 7,
                    width: "5%",
                    zIndex: 1000,
                    border: "none",
                    borderRadius: "25px",
                    background: "rgba(211,211,211 ,0.55 )",
                }}
                onClick={closeModal}
            >
                <span aria-hidden="true">&times;</span>
            </button>
            {isLoading ? (
                <Loading />
            ) : (
                <GraphAlumnDetailsModalComponent
                    alumn={alumn}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

export default GraphAlumnDetailsModalContainer;
