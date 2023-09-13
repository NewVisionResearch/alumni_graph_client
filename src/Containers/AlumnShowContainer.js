import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

import AlumnShowComponent from "../Components/AlumnShowComponent";
import Loading from "../Components/Loading";
import {
    fetchAlumnById,
    patchLabPublication,
    patchLabAlumnPublication,
    refetchAlumnPublications,
    updateSearchNamesForAlumn,
    streamJob,
} from "../services/api";

import "../styles/AlumnShow.css";
import { useContext } from "react";
import { ToastContext } from "../Context/ToastContext";

function AlumnShowContainer({
    alumnShowIdAndName,
    handleDeleteAlumn,
    addAlumnLoading,
    progressStatus,
    setProgressStatus,
    progressPercentage,
    setProgressPercentage,
}) {
    const showToast = useContext(ToastContext);

    const [alumn, setAlumn] = useState({
        full_name: "",
        search_query: "",
        my_lab_alumn_publications: [],
    });
    const [idObj, setIdObj] = useState({});
    const [editSearchNames, setEditSearchNames] = useState(false);
    const [editingReseracherError, setEditingReseracherError] = useState([]);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [eventSource, setEventSource] = useState(null);

    useEffect(() => {
        if (alumnShowIdAndName) {
            setLoading(true);

            setAlumn(
                (prev) =>
                    (prev = {
                        ...prev,
                        full_name: alumnShowIdAndName.full_name,
                    })
            );

            const controller = new AbortController();
            const signal = controller.signal;

            fetchAlumnById(alumnShowIdAndName.alumn_id, signal)
                .then((res) => {
                    if (!res.ok) throw res;

                    return res.json();
                })
                .then((alumnObj) => {
                    setAlumn(alumnObj);
                    setLoading(false);
                })
                .catch((err) => {
                    if (err.name !== "AbortError") {
                        console.error(err);
                        setLoading(false);
                    }
                });

            setEditSearchNames(false);

            return () => {
                controller.abort();
            };
        }
    }, [alumnShowIdAndName]);

    useEffect(() => {
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    const invalidatePublication = async (labPublicationId) => {
        let bodyObj = {
            lab_publication: {
                display: false,
            },
        };

        try {
            const res = await patchLabPublication(labPublicationId, bodyObj);
            if (!res.ok) throw res;

            const publicationId = await res.json();
            let newArray = alumn.my_lab_alumn_publications.filter(
                (ap) => ap.publication.id !== publicationId
            );

            setAlumn({ ...alumn, my_lab_alumn_publications: newArray });
        } catch (err) {
            console.error(err);
        }
    };

    const updateIdArray = (id, display) => {
        let newIdObj = { ...idObj };
        newIdObj[id] = display;
        setIdObj(newIdObj);
    };

    const updateDatabase = async () => {
        for (const id in idObj) {
            let bodyObj = {
                lab_alumn_publication: {
                    alumn_id: alumnShowIdAndName.alumn_id,
                    alumn_publication_id: id,
                    display: idObj[id],
                },
            };

            try {
                const res = await patchLabAlumnPublication(bodyObj);

                if (!res.ok) throw res;

                setIdObj({});
            } catch (err) {
                console.error(err);
            }
        }
    };

    const initializeEventSource = (job_id) => {
        const es = streamJob(job_id, "fetch");

        es.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            const jobData = JSON.parse(eventData.message);
            const jobStatus = jobData.job.status;

            switch (jobStatus) {
                case "complete":
                    setProgressStatus("");
                    setProgressPercentage(0);

                    setAlumn({
                        alumn_id: jobData.details.alumn_id,
                        full_name: jobData.details.full_name,
                        search_query: jobData.details.search_query,
                        my_lab_alumn_publications:
                            jobData.details.my_lab_alumn_publications,
                    });

                    setLoading(false);
                    break;

                case "working":
                    setProgressStatus(jobStatus);
                    setProgressPercentage(jobData.job.percent);
                    break;

                case "queued":
                case "retrying":
                    setProgressStatus(jobStatus);
                    setProgressPercentage(0);
                    break;

                default:
                    setLoading(false);

                    throw new Error(
                        jobData.job.message || "Unknown error occurred"
                    );
            }

            if (jobData.job.status === "complete") {
                es.close();
            }
        };

        es.onerror = (error) => {
            console.error("EventSource failed:", error);
            es.close();
        };

        setEventSource(es);
    };

    const refetchPublications = async () => {
        try {
            const res = await refetchAlumnPublications(
                alumnShowIdAndName.alumn_id
            );

            if (!res.ok) throw res;
            setLoading(true);

            const { job_id } = await res.json();

            initializeEventSource(job_id);
        } catch (err) {
            console.error(err);
        }
    };

    const updateSearchNames = async (alumnInfo) => {
        let bodyObj = {
            alumn: {
                ...alumnInfo,
                display_name: alumnInfo.display_name.toLowerCase().trim(),
            },
        };

        try {
            setEditingReseracherError("");

            const res = await updateSearchNamesForAlumn(
                alumnShowIdAndName.alumn_id,
                bodyObj
            );

            if (!res.ok) throw res;

            const alumnObj = await res.json();

            setAlumn(alumnObj);
            setEditSearchNames(false);
        } catch (err) {
            const error = await err.json();
            setEditingReseracherError(error.error);
        }
    };

    const handleRemoveAlumn = () => {
        setShowConfirmDeleteModal(true);
    };

    const closeForm = () => {
        setEditSearchNames(false);
        setEditingReseracherError("");
    };

    const handleAlumnDeletion = async (alumnId) => {
        setIsDeleting(true);

        try {
            await handleDeleteAlumn(alumnId);
            showToast({
                header: "Delete Success!",
                body: "The researcher has been deleted.",
            });
        } catch (err) {
            const error = await err.json();
            console.error(error);
            showToast({
                header: "Delete Error",
                body: "Please try again later or contact the administrator.",
            });
        } finally {
            setIsDeleting(false);
            setShowConfirmDeleteModal(false);
        }
    };

    return (
        <div className="alumn-show">
            {addAlumnLoading ? (
                <Loading
                    progressPercentage={progressPercentage}
                    progressStatus={progressStatus}
                />
            ) : alumnShowIdAndName ? (
                <>
                    <AlumnShowComponent
                        alumn={alumn}
                        editSearchNames={editSearchNames}
                        setEditSearchNames={setEditSearchNames}
                        handleRemoveAlumn={handleRemoveAlumn}
                        invalidatePublication={invalidatePublication}
                        updateIdArray={updateIdArray}
                        loading={loading}
                        updateDatabase={updateDatabase}
                        refetchPublications={refetchPublications}
                        updateSearchNames={updateSearchNames}
                        editingReseracherError={editingReseracherError}
                        idObj={idObj}
                        closeForm={closeForm}
                        progressStatus={progressStatus}
                        progressPercentage={progressPercentage}
                    />

                    <Modal
                        show={showConfirmDeleteModal}
                        onHide={() => setShowConfirmDeleteModal(false)}
                    >
                        <Modal.Header>
                            <Modal.Title>
                                Delete {alumnShowIdAndName.full_name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this researcher?
                            This action cannot be undone, and you would need to
                            re-add the researcher if necessary.
                        </Modal.Body>
                        <Modal.Footer className="mr-auto">
                            <Button
                                className="delete-button"
                                type="button"
                                disabled={isDeleting}
                                onClick={() =>
                                    handleAlumnDeletion(
                                        alumnShowIdAndName.alumn_id
                                    )
                                }
                            >
                                {isDeleting ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        {" Deleting..."}
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </Button>
                            <Button
                                className="cancel-button"
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setShowConfirmDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <h1 className="text-center m-2">
                    Select a researcher to view here
                </h1>
            )}
        </div>
    );
}

export default AlumnShowContainer;
