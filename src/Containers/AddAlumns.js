import { useState, useContext, useRef, useMemo } from "react";
import { Button, Modal, Row, Col, Form, Spinner } from "react-bootstrap";

import NewAlumnForm from "./NewAlumnForm";
import { AdminContext } from "../Context/Context";
import { ToastContext } from "../Context/ToastContext";
import { fetchAlumns } from "../services/api";

import "../styles/AddAlumns.css";
import { useEffect } from "react";

function AddAlumns({
    alumns,
    setAlumns,
    openAlumnShow,
    setAddAlumnLoading,
    setProgressStatus,
    setProgressPercentage,
}) {
    const admin = useContext(AdminContext);
    const showToast = useContext(ToastContext);

    const [showAlumnQuerySearchModal, setShowAlumnQuerySearchModal] =
        useState(false);
    const [showAddAlumnModal, setShowAddAlumnModal] = useState(false);
    const [alumnQueryResults, setAlumnQueryResults] = useState({});
    const [addAlumnDisplayName, setAddAlumnDisplayName] = useState("");
    const [duplicateDisplayNameError, setDuplicateDisplayNameError] = useState(
        {}
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [eventSource, setEventSource] = useState(null);

    const abortControllerRef = useRef(new AbortController());

    const { isResultCountPlural, isResultCountZero, resultCount } =
        useMemo(() => {
            const count = alumnQueryResults.esearchresult?.count;
            return {
                isResultCountPlural: count !== "1",
                isResultCountZero: count === "0",
                resultCount: count,
            };
        }, [alumnQueryResults.esearchresult?.count]);

    const queryTranslation = useMemo(() => {
        return alumnQueryResults.esearchresult?.querytranslation;
    }, [alumnQueryResults.esearchresult?.querytranslation]);

    const handleAlumnQuerySearchModalShow = () =>
        setShowAlumnQuerySearchModal(true);

    const handleAlumnQuerySearchModalClose = () => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        setShowAlumnQuerySearchModal(false);
    };

    const handleAddAlumnModalShow = () => setShowAddAlumnModal(true);

    const handleAddAlumnModalClose = () => {
        setShowAddAlumnModal(false);
        setAddAlumnDisplayName("");
        setDuplicateDisplayNameError("");
    };

    const handleContinue = () => {
        handleAlumnQuerySearchModalClose();
        handleAddAlumnModalShow();
    };

    const initializeEventSource = (job_id) => {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const es = new EventSource(`${baseUrl}/jobs/${job_id}/stream`);

        es.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            const jobData = JSON.parse(eventData.message);
            const jobStatus = jobData.job.status;

            switch (jobStatus) {
                case "complete":
                    const newArray = [
                        ...alumns,
                        {
                            alumn_id: jobData.details.alumn_id,
                            full_name: jobData.details.full_name,
                            search_query: jobData.details.search_query,
                            my_lab_alumn_publications:
                                jobData.details.my_lab_alumn_publications,
                        },
                    ];

                    setProgressStatus("");
                    setProgressPercentage(0);

                    setAddAlumnLoading(false);
                    setAlumns(newArray);
                    openAlumnShow(
                        jobData.details.alumn_id,
                        jobData.details.full_name
                    );
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

    const addAlumn = async () => {
        setIsSaving(true);
        setDuplicateDisplayNameError("");

        try {
            const alumnObj = {
                alumn: {
                    display_name: addAlumnDisplayName.toLowerCase(),
                    lab_id: admin.labId,
                    search_query:
                        alumnQueryResults.esearchresult.querytranslation,
                },
            };

            const res = await fetchAlumns(alumnObj);

            if (!res.ok) throw res;

            const alumnsResponse = await res.json();
            const { job_id } = alumnsResponse;

            handleAddAlumnModalClose();
            setAddAlumnLoading(true);

            initializeEventSource(job_id);
        } catch (error) {
            let errorResponse = await error.json();
            console.error(errorResponse);
            setDuplicateDisplayNameError(errorResponse);
            setAddAlumnLoading(false);
            showToast({
                header: "Add Researcher Error",
                body: "Please check again later",
            });
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    return (
        <div className="add-alumns">
            <h1 className="text-center m-2">Add Researcher</h1>
            <NewAlumnForm
                handleModalShow={handleAlumnQuerySearchModalShow}
                setAlumnQueryResults={setAlumnQueryResults}
                setIsLoading={setIsLoading}
                signal={abortControllerRef.current.signal}
            />
            {/* Alumn Query Search Modal BEGINS*/}
            <Modal
                show={showAlumnQuerySearchModal}
                onHide={handleAlumnQuerySearchModalClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Query Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner
                                className="add-alumns-spinner"
                                animation="border"
                                role="loading"
                            />
                        </div>
                    ) : (
                        <div>
                            <p>
                                Your query <strong>{queryTranslation}</strong>{" "}
                                came back with <strong>{resultCount}</strong>{" "}
                                {isResultCountPlural ? "results." : "result."}
                            </p>
                            {isResultCountZero ? (
                                <p>Please try a different query.</p>
                            ) : (
                                <p>
                                    Would you like to continue and save this
                                    researcher and their{" "}
                                    {isResultCountPlural
                                        ? "publications?"
                                        : "publication?"}
                                </p>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="cancel-button"
                        type="button"
                        onClick={handleAlumnQuerySearchModalClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="button"
                        type="button"
                        disabled={isResultCountZero || isLoading}
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Alumn Query Search Modal ENDS*/}
            {/* Add Alumn Modal BEGINS*/}
            <Modal show={showAddAlumnModal} onHide={handleAddAlumnModalClose}>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addAlumn();
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add Researcher</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="border-bottom">
                        <Row>
                            <Col>
                                <p>
                                    Query:{" "}
                                    <strong>
                                        {JSON.stringify(queryTranslation)}
                                    </strong>
                                </p>
                                <p>
                                    Results:{" "}
                                    <strong>
                                        {JSON.stringify(resultCount)}
                                    </strong>{" "}
                                    {isResultCountPlural
                                        ? "results."
                                        : "result."}
                                </p>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Body>
                        <Form.Group as={Row} controlId="formDisplayName">
                            <Form.Label column sm={4}>
                                Display Name:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter display name"
                                    name="displayName"
                                    required
                                    value={addAlumnDisplayName}
                                    onChange={({ target: { name, value } }) =>
                                        setAddAlumnDisplayName(value)
                                    }
                                />
                                <Form.Text className="text-muted">
                                    This is the name that will be displayed in
                                    your graph. We suggest entering the
                                    researcher's full name.
                                </Form.Text>
                                {duplicateDisplayNameError.error ? (
                                    duplicateDisplayNameError.error.map(
                                        (val) => (
                                            <Form.Text className="text-danger">
                                                {val}
                                            </Form.Text>
                                        )
                                    )
                                ) : (
                                    <></>
                                )}
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="cancel-button"
                            type="button"
                            onClick={handleAddAlumnModalClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="button"
                            disabled={
                                addAlumnDisplayName.length === 0 || isSaving
                            }
                            type="submit"
                        >
                            {isSaving ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    {" Saving..."}
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* Add Alumn Modal ENDS*/}
        </div>
    );
}

export default AddAlumns;
