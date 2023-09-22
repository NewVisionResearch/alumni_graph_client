import { useState, useEffect, useContext } from "react";

import AlumnShowContainer from "./AlumnShowContainer";
import { ToastContext } from "../../../Context/ToastContext/ToastContext";
import ConfirmationModal from "../../../Components/Modal/ConfirmationModal/ConfirmationModal";
import {
    fetchAlumnById,
    deleteAlumnPublication,
    patchAlumnPublication,
    refetchAlumnPublications,
    updateSearchNamesForAlumn,
    streamJob,
} from "../../../services/api";

import "./styles/AlumnShow.css";

function AlumnShowController({
    alumnShowIdAndName,
    handleDeleteAlumn,
    progressMap,
    setProgressMap,
}) {
    const showToast = useContext(ToastContext);

    const [alumn, setAlumn] = useState({
        full_name: "",
        search_query: "",
        my_alumn_publications: [],
    });
    const [idObj, setIdObj] = useState({});
    const [editSearchNames, setEditSearchNames] = useState(false);
    const [editingReseracherError, setEditingReseracherError] = useState([]);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [eventSourceMap, setEventSourceMap] = useState(new Map());

    let doesProgressMapContainAlumn = false;

    if (alumnShowIdAndName) {
        doesProgressMapContainAlumn = progressMap.has(
            alumnShowIdAndName.full_name
        );
    }

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

            if (!doesProgressMapContainAlumn) {
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
        }
    }, [alumnShowIdAndName, doesProgressMapContainAlumn]);

    useEffect(() => {
        return () => {
            eventSourceMap.forEach((connection, key) => {
                connection.close();
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const invalidatePublication = async (alumn_publication_id) => {
        try {
            const res = await deleteAlumnPublication(alumn_publication_id);
            if (!res.ok) throw res;

            const publicationId = await res.json();
            let newArray = alumn.my_alumn_publications.filter(
                (ap) => ap.publication.id !== publicationId
            );

            setAlumn({ ...alumn, my_alumn_publications: newArray });
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
                alumn_publication: {
                    alumn_id: alumnShowIdAndName.alumn_id,
                    alumn_publication_id: id,
                    display: idObj[id],
                },
            };

            try {
                const res = await patchAlumnPublication(bodyObj, id);

                if (!res.ok) throw res;

                setIdObj({});
            } catch (err) {
                console.error(err);
            }
        }
    };

    const initializeEventSource = (job_id) => {
        const es = streamJob(job_id, "fetch");

        setEventSourceMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(job_id, es);
            return newMap;
        });

        es.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            const jobData = JSON.parse(eventData.message);
            const jobStatus = jobData.job.status;

            switch (jobStatus) {
                case "complete":
                    setProgressMap((prevMap) => {
                        const newMap = new Map(prevMap);
                        newMap.delete(alumn.full_name);
                        return newMap;
                    });

                    setAlumn({
                        alumn_id: jobData.details.alumn_id,
                        full_name: jobData.details.full_name,
                        search_query: jobData.details.search_query,
                        my_alumn_publications:
                            jobData.details.my_alumn_publications,
                    });

                    setLoading(false);
                    break;

                case "working":
                    setProgressMap((prevMap) => {
                        const newMap = new Map(prevMap);
                        newMap.set(alumn.full_name, {
                            status: jobStatus,
                            percentage: jobData.job.percent,
                        });
                        return newMap;
                    });
                    break;

                case "queued":
                case "retrying":
                    setProgressMap((prevMap) => {
                        const newMap = new Map(prevMap);
                        newMap.set(alumn.full_name, {
                            status: jobStatus,
                            percentage: 0,
                        });
                        return newMap;
                    });
                    break;

                default:
                    setLoading(false);

                    throw new Error(
                        jobData.job.message || "Unknown error occurred"
                    );
            }

            if (jobData.job.status === "complete") {
                es.close();
                setEventSourceMap((prevMap) => {
                    const newMap = new Map(prevMap);
                    newMap.delete(job_id);
                    return newMap;
                });
            }
        };

        es.onerror = (error) => {
            console.error("EventSource failed:", error);
            es.close();
        };

        setEventSourceMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.delete(job_id);
            return newMap;
        });
    };

    const refetchPublications = async () => {
        try {
            const res = await refetchAlumnPublications(
                alumnShowIdAndName.alumn_id
            );

            if (!res.ok) throw res;
            setLoading(true);

            const { job_id } = await res.json();
            setProgressMap((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(alumnShowIdAndName.full_name, {});
                return newMap;
            });

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
            {alumnShowIdAndName ? (
                <>
                    <AlumnShowContainer
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
                        progressMap={progressMap}
                    />

                    <ConfirmationModal
                        show={showConfirmDeleteModal}
                        title={`Delete ${alumnShowIdAndName.full_name}`}
                        body="Are you sure you want to delete this researcher? This action cannot be undone, and you would need to re-add the researcher if necessary."
                        confirmText="Delete"
                        disableCancel={isDeleting}
                        isConfirming={isDeleting}
                        onConfirm={() =>
                            handleAlumnDeletion(alumnShowIdAndName.alumn_id)
                        }
                        onCancel={() => setShowConfirmDeleteModal(false)}
                    />
                </>
            ) : (
                <h1 className="text-center m-2">
                    Select a researcher to view here
                </h1>
            )}
        </div>
    );
}

export default AlumnShowController;
