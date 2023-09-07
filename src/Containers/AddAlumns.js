import { useState, useContext, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Row, Col, Form, Spinner } from "react-bootstrap";

import NewAlumnForm from "./NewAlumnForm";
import { AdminContext } from "../Context/Context";
import { fetchAlumns, pollJobStatus } from "../services/api";

import "../styles/AddAlumns.css";

function AddAlumns({ alumns, setAlumns, openAlumnShow, setAddAlumnLoading }) {
    const admin = useContext(AdminContext);

    const [showAlumnQuerySearchModal, setShowAlumnQuerySearchModal] =
        useState(false);
    const [showAddAlumnModal, setShowAddAlumnModal] = useState(false);
    const [alumnQueryResults, setAlumnQueryResults] = useState({});
    const [addAlumnDisplayName, setAddAlumnDisplayName] = useState("");
    const [duplicateDisplayNameError, setDuplicateDisplayNameError] = useState(
        {}
    );
    const [isLoading, setIsLoading] = useState(false);

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

    const navigate = useNavigate();

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

    const addAlumn = async () => {
        try {
            const alumnObj = {
                alumn: {
                    display_name: addAlumnDisplayName.toLowerCase(),
                    lab_id: admin.labId,
                    search_query: alumnQueryResults.esearchresult.querytranslation,
                },
            };

            const res = await fetchAlumns(alumnObj);

            if (!res.ok) throw res;

            const alumnsResponse = await res.json();
            const { job_id } = alumnsResponse;

            handleAddAlumnModalClose();
            setAddAlumnLoading(true);

            const pollJobStatusInterval = setInterval(async () => {
                try {
                    const jobRes = await pollJobStatus(job_id);

                    if (!jobRes.ok) throw new Error("Job status request failed");

                    const jobData = await jobRes.json();

                    if (jobData.job.status === "completed") {
                        const newArray = [
                            ...alumns,
                            {
                                alumn_id: jobData.alumn_id,
                                full_name: jobData.full_name,
                                search_query: jobData.search_query,
                                my_lab_alumn_publications: jobData.my_lab_alumn_publications,
                            },
                        ];

                        setAddAlumnLoading(false);
                        clearInterval(pollJobStatusInterval);
                        setAlumns(newArray);
                        openAlumnShow(jobData.alumn_id, jobData.full_name);
                    } else if (jobData.job.status === "failed") {
                        throw jobData.error;
                    }
                } catch (error) {
                    setAddAlumnLoading(false);
                    clearInterval(pollJobStatusInterval);
                    console.error("Job failed:", error);
                    navigate("/error");
                }
            }, 5000);
        } catch (error) {
            let errorResponse = await error.json();
            console.error(errorResponse);
            setDuplicateDisplayNameError(errorResponse);
            setAddAlumnLoading(false);
        }
    };

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
                                Your query <strong>{queryTranslation}</strong> came back with{" "}
                                <strong>{resultCount}</strong>{" "}
                                {isResultCountPlural ? "results." : "result."}
                            </p>
                            {isResultCountZero ? (
                                <p>Please try a different query.</p>
                            ) : (
                                <p>
                                    Would you like to continue and save this researcher and their{" "}
                                    {isResultCountPlural ? "publications?" : "publication?"}
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
                                    Query: <strong>{JSON.stringify(queryTranslation)}</strong>
                                </p>
                                <p>
                                    Results: <strong>{JSON.stringify(resultCount)}</strong>{" "}
                                    {isResultCountPlural ? "results." : "result."}
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
                                    This is the name that will be displayed in your graph. We
                                    suggest entering the researcher's full name.
                                </Form.Text>
                                {duplicateDisplayNameError.error ? (
                                    duplicateDisplayNameError.error.map((val) => (
                                        <Form.Text className="text-danger">{val}</Form.Text>
                                    ))
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
                        >
                            Cancel
                        </Button>
                        <Button
                            className="button"
                            disabled={addAlumnDisplayName.length === 0}
                            type="submit"
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* Add Alumn Modal ENDS*/}
        </div>
    );
}

export default AddAlumns;
