import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ListGroup, Button, Modal } from "react-bootstrap";
import Loading from "../Components/Loading";
import { byLastName } from "../services/sorts";
import FormComponent from "./NewAlumnForm";
import { AdminContext } from "../Context/Context";

function AddAlumns({
    onAlumnsChange,
    openAlumnShow,
    removeAlumnId,
    confirmRemovedAlumn,
}) {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const admin = useContext(AdminContext);

    const [alumns, setAlumns] = useState([]);
    const [showAlumnQuerySearchModal, setShowAlumnQuerySearchModal] =
        useState(false);
    const [alumnQueryResults, setAlumnQueryResults] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleModalClose = () => setShowAlumnQuerySearchModal(false);
    const handleModalShow = () => setShowAlumnQuerySearchModal(true);

    const memoizedAlumnFetch = useCallback(async () => {
        const token = localStorage.getItem("jwt");

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const res = await fetch(
                `${baseUrl}/alumns/${admin.labId}/index`,
                options
            );
            if (!res.ok) {
                throw res;
            }
            const alumnsArray = await res.json();
            return setAlumns(alumnsArray);
        } catch (res) {
            console.error(res);
            navigate("/error");
        }
    }, [navigate, baseUrl, admin.labId]);

    useEffect(() => {
        if (!alumns.length && admin.labId !== "") {
            memoizedAlumnFetch();
        }

        onAlumnsChange(alumns.length);
    }, [alumns.length, memoizedAlumnFetch, admin, onAlumnsChange]);

    useEffect(() => {
        if (alumns.length) {
            setLoading(false);
        }
    }, [alumns.length]);

    useEffect(() => {
        if (removeAlumnId) {
            memoizedAlumnFetch().then(confirmRemovedAlumn);
        }
    }, [memoizedAlumnFetch, removeAlumnId, confirmRemovedAlumn]);

    const addAlumn = (alumnDisplayName) => {
        setShowAlumnQuerySearchModal(false);
        setLoading(true);
        const token = localStorage.getItem("jwt");

        let alumnObj = {
            alumn: {
                display_name: alumnDisplayName.toLowerCase(),
                lab_id: admin.labId,
                search_names: [alumnQueryResults.esearchresult.querytranslation]
            },
        };

        let options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(alumnObj),
        };

        fetch(`${baseUrl}/alumns`, options)
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then((response) => {
                const { job_id } = response;

                const pollJobStatus = setInterval(() => {
                    fetch(`${baseUrl}/jobs/${job_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                        .then((res) => {
                            if (!res.ok) {
                                throw new Error("Job status request failed");
                            }

                            return res.json();
                        })
                        .then((res) => {
                            if (res.job.status === "completed") {
                                clearInterval(pollJobStatus);
                                let newArray = [
                                    ...alumns,
                                    {
                                        alumn_lab_id: res.alumn_lab_id,
                                        full_name: res.full_name,
                                        search_names: res.search_names,
                                        my_lab_alumn_publications: res.my_lab_alumn_publications,
                                    },
                                ];
                                setAlumns(newArray);
                                openAlumnShow(res.alumn_lab_id);
                            } else if (res.job.status === "failed") {
                                clearInterval(pollJobStatus);
                                console.error("Job failed:", res.error);
                                navigate("/error");
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            clearInterval(pollJobStatus);
                            navigate("/error");
                        });
                }, 5000);
            })
            .catch((err) => {
                console.error(err);
                navigate("/error");
            });
    };

    return (
        <div className="add-alumns mr-5 mb-4">
            <FormComponent
                submitInput={addAlumn}
                handleModalShow={handleModalShow}
                setAlumnQueryResults={setAlumnQueryResults}
            />
            <Modal show={showAlumnQuerySearchModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Query: {JSON.stringify(alumnQueryResults.esearchresult?.querytranslation)}</p>
                        <p>Query returned with {JSON.stringify(alumnQueryResults.esearchresult?.count)} results</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => addAlumn(JSON.stringify(alumnQueryResults.esearchresult.querytranslation))}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {loading ? (
                <Loading />
            ) : (
                <div
                    style={{
                        display: "flex",
                        maxHeight: "700px",
                        overflow: "hidden",
                        overflowY: "scroll",
                    }}
                >
                    <ListGroup as="ul" style={{ width: "100%" }}>
                        {byLastName(alumns).map((alumn) => (
                            <ListGroup.Item
                                as="li"
                                key={alumn.alumn_lab_id}
                                onClick={() => openAlumnShow(alumn.alumn_lab_id)}
                                className=""
                            >
                                {alumn.search_names[1]}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </div>
    );
}

export default AddAlumns;
