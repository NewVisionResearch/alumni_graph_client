import { useState, useEffect, useContext, useRef } from "react";

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
import {
    ALUMN_SHOW_STEPS,
    EDITING_RESEARCHER_STEPS,
} from "../../../Constants/TourSteps";

function AlumnShowController({
    alumnShowIdAndName,
    handleDeleteAlumn,
    progressMap,
    setProgressMap,
    handleChangeSteps,
}) {
    const showToast = useContext(ToastContext);

    const [alumn, setAlumn] = useState({
        full_name: "",
        search_query: "",
        my_alumn_publications: [],
    });
    const [idObj, setIdObj] = useState({});
    const [showEditAlumnForm, setShowEditAlumnForm] = useState(false);
    const [editingReseracherError, setEditingReseracherError] = useState([]);
    const [showConfirmDeleteAlumnModal, setShowConfirmDeleteAlumnModal] =
        useState(false);
    const [
        showConfirmDeletePublicationModal,
        setShowConfirmDeletePublicationModal,
    ] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeletingPublication, setIsDeletingPublication] = useState(false);
    const [eventSourceMap, setEventSourceMap] = useState(new Map());
    const [isSavingAlumnEdit, setIsSavingAlumnEdit] = useState(false);
    const [isUpdatingPublication, setIsUpdatingPublication] = useState(false);

    const publicationToDelete = useRef(null);

    let doesProgressMapContainAlumn = false;

    if (alumnShowIdAndName) {
        doesProgressMapContainAlumn = progressMap.has(
            alumnShowIdAndName.full_name
        );
    }

    useEffect(() => {
        if (alumnShowIdAndName) {
            const handleShowEditAlumnFormStepsChange = (prevSteps) => {
                if (showEditAlumnForm) {
                    const filteredForEditing = prevSteps.filter(
                        (step) =>
                            !ALUMN_SHOW_STEPS.some(
                                (alumnStep) =>
                                    alumnStep.selector === step.selector
                            )
                    );

                    const shouldAddEditingSteps = !prevSteps.some(
                        (step) =>
                            step.selector ===
                            EDITING_RESEARCHER_STEPS[0].selector
                    );

                    return shouldAddEditingSteps
                        ? [...filteredForEditing, ...EDITING_RESEARCHER_STEPS]
                        : filteredForEditing;
                } else {
                    const filteredForAlumnShow = prevSteps.filter(
                        (step) =>
                            !EDITING_RESEARCHER_STEPS.some(
                                (editStep) =>
                                    editStep.selector === step.selector
                            )
                    );
                    const shouldAddAlumnSteps = !prevSteps.some(
                        (step) => step.selector === ALUMN_SHOW_STEPS[0].selector
                    );
                    return shouldAddAlumnSteps
                        ? [...filteredForAlumnShow, ...ALUMN_SHOW_STEPS]
                        : filteredForAlumnShow;
                }
            };

            handleChangeSteps(
                handleShowEditAlumnFormStepsChange,
                -1,
                false,
                true
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showEditAlumnForm, alumnShowIdAndName]);

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

                setShowEditAlumnForm(false);

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

    const handleShowEditAlumnForm = () => {
        setShowEditAlumnForm(true);
    };

    const handleDeletePublication = (alumn_publication_id) => {
        publicationToDelete.current = alumn_publication_id;
        setShowConfirmDeletePublicationModal(true);
    };

    const deletePublication = async () => {
        setIsDeletingPublication(true);

        try {
            const res = await deleteAlumnPublication(
                publicationToDelete.current
            );

            if (!res.ok) throw res;

            showToast({
                header: "Delete Success!",
                body: "The publication has been deleted.",
            });

            const { publication_id } = await res.json();

            let newArray = alumn.my_alumn_publications.filter(
                (ap) => ap.publication.id !== publication_id
            );

            setAlumn({ ...alumn, my_alumn_publications: newArray });
        } catch (err) {
            console.error(err);
            showToast({
                header: "Delete Error",
                body: "Please try again later or contact the administrator.",
            });
        } finally {
            setIsDeletingPublication(false);
            setShowConfirmDeletePublicationModal(false);
            publicationToDelete.current = null;
        }
    };

    const updateIdArray = (id, display) => {
        let newIdObj = { ...idObj };
        newIdObj[id] = display;
        setIdObj(newIdObj);
    };

    const updateDatabase = async () => {
        setIsUpdatingPublication(true);

        try {
            for (const id in idObj) {
                let bodyObj = {
                    alumn_publication: {
                        alumn_id: alumnShowIdAndName.alumn_id,
                        alumn_publication_id: id,
                        display: idObj[id],
                    },
                };
                const res = await patchAlumnPublication(bodyObj, id);

                if (!res.ok) throw res;

                setIdObj({});
            }

            showToast({
                header: "Update Success!",
                body: "The publications have been updated.",
            });
        } catch (err) {
            console.error(err);
            showToast({
                header: "Publication Update Error",
                body: "Please try again later or contact the administrator.",
            });
        } finally {
            setIsUpdatingPublication(false);
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
        setIsSavingAlumnEdit(true);

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
            setShowEditAlumnForm(false);
            showToast({
                header: "Save Success!",
                body: "The researcher has been edited.",
            });
        } catch (err) {
            const error = await err.json();
            setEditingReseracherError(error.error);
        } finally {
            setIsSavingAlumnEdit(false);
        }
    };

    const handleRemoveAlumn = () => {
        setShowConfirmDeleteAlumnModal(true);
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
            setShowConfirmDeleteAlumnModal(false);
        }
    };

    const closeForm = () => {
        setShowEditAlumnForm(false);
        setEditingReseracherError("");
    };

    return (
        <div className="alumn-show">
            {alumnShowIdAndName ? (
                <>
                    <AlumnShowContainer
                        alumn={alumn}
                        showEditAlumnForm={showEditAlumnForm}
                        handleShowEditAlumnForm={handleShowEditAlumnForm}
                        handleRemoveAlumn={handleRemoveAlumn}
                        handleDeletePublication={handleDeletePublication}
                        updateIdArray={updateIdArray}
                        loading={loading}
                        updateDatabase={updateDatabase}
                        refetchPublications={refetchPublications}
                        updateSearchNames={updateSearchNames}
                        editingReseracherError={editingReseracherError}
                        idObj={idObj}
                        closeForm={closeForm}
                        progressMap={progressMap}
                        isSavingAlumnEdit={isSavingAlumnEdit}
                        isUpdatingPublication={isUpdatingPublication}
                    />

                    <ConfirmationModal
                        show={showConfirmDeleteAlumnModal}
                        title={`Delete ${alumnShowIdAndName.full_name}`}
                        body="Are you sure you want to delete this researcher? This action cannot be undone, and you would need to re-add the researcher if necessary."
                        confirmText="Delete"
                        disableCancel={isDeleting}
                        isConfirming={isDeleting}
                        onConfirm={() =>
                            handleAlumnDeletion(alumnShowIdAndName.alumn_id)
                        }
                        onCancel={() => setShowConfirmDeleteAlumnModal(false)}
                    />

                    <ConfirmationModal
                        show={showConfirmDeletePublicationModal}
                        title="Delete Publication"
                        body="Are you sure you want to delete this publication? This action cannot be undone, and you would need to refetch the publication if necessary."
                        confirmText="Delete"
                        disableCancel={isDeletingPublication}
                        isConfirming={isDeletingPublication}
                        onConfirm={() => deletePublication()}
                        onCancel={() => {
                            setShowConfirmDeletePublicationModal(false);
                            publicationToDelete.current = null;
                        }}
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
