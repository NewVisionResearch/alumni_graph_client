import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Row, Col, Form } from "react-bootstrap";

import FormComponent from "./NewAlumnForm";
import { AdminContext } from "../Context/Context";
import { fetchAlumns, pollJobStatus } from "../services/api";

function AddAlumns({ alumns, setAlumns, openAlumnShow, setAddAlumnLoading }) {
    const admin = useContext(AdminContext);

    const [showAlumnQuerySearchModal, setShowAlumnQuerySearchModal] = useState(false);
    const [showAddAlumnModal, setShowAddAlumnModal] = useState(false);
    const [alumnQueryResults, setAlumnQueryResults] = useState({});
    const [addAlumnDisplayName, setAddAlumnDisplayName] = useState("");
    const [duplicateDisplayNameError, setDuplicateDisplayNameError] = useState({});

    const navigate = useNavigate();

    const handleAlumnQuerySearchModalShow = () =>
        setShowAlumnQuerySearchModal(true);

    const handleAlumnQuerySearchModalClose = () =>
        setShowAlumnQuerySearchModal(false);

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
                        openAlumnShow(jobData.alumn_id);
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
        <div className="add-alumns mr-5 mb-4">
            <FormComponent
                handleModalShow={handleAlumnQuerySearchModalShow}
                setAlumnQueryResults={setAlumnQueryResults}
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
                    <div>
                        <p>
                            Your query{" "}
                            <strong>
                                {alumnQueryResults.esearchresult?.querytranslation}
                            </strong>{" "}
                            came back with{" "}
                            <strong>{alumnQueryResults.esearchresult?.count}</strong> results.
                        </p>
                        {alumnQueryResults.esearchresult?.count === "0" ? (
                            <p>Please try a different query.</p>
                        ) : (
                            <p>
                                Would you like to continue and save this researcher and their
                                publications?
                            </p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleAlumnQuerySearchModalClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={alumnQueryResults.esearchresult?.count === "0"}
                        variant="primary"
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
                    <Modal.Body style={{ borderBottom: "1px solid #dee2e6" }}>
                        <Row>
                            <Col>
                                <p>
                                    Query:{" "}
                                    <strong>
                                        {JSON.stringify(
                                            alumnQueryResults.esearchresult?.querytranslation
                                        )}
                                    </strong>
                                </p>
                            </Col>
                            <Col>
                                <p>
                                    Results:{" "}
                                    <strong>
                                        {JSON.stringify(alumnQueryResults.esearchresult?.count)}
                                    </strong>{" "}
                                    results.
                                </p>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Body>
                        <div>
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
                                        suggest entering the researchers full name.
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
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleAddAlumnModalClose}>
                            Cancel
                        </Button>
                        <Button
                            disabled={addAlumnDisplayName.length === 0}
                            type="submit"
                            variant="primary"
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
