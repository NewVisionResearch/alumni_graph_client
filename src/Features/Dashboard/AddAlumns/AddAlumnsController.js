import { useState, useContext, useRef, useMemo, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import { useTour } from "@reactour/tour";

import { AdminContext } from "../../../Context/AdminContext/AdminContext";
import { ToastContext } from "../../../Context/ToastContext/ToastContext";

import NewAlumnForm from "./NewAlumnForm/NewAlumnForm";
import ConfirmationModal from "../../../Components/Modal/ConfirmationModal/ConfirmationModal";

import {
    ADD_RESEARCHER_DROPDOWN_MENU_STEPS,
    ADD_RESEARCHER_INITIAL_STEPS,
    ADD_RESEARCHER_MODAL_STEPS,
    QUERY_RESULTS_MODAL_STEPS,
} from "../../../Constants/TourSteps";

import {
    fetchAlumns,
    streamJob,
    fetchAlumnNameQuerySearchResults,
} from "../../../services/api";

import "./styles/AddAlumns.css";

function AddAlumnsController({
    alumns,
    setAlumns,
    handleItemClick,
    setProgressMap,
    handleChangeSteps,
}) {
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
    const [eventSourceMap, setEventSourceMap] = useState(new Map());
    const [previousTourStep, setPreviousTourStep] = useState(0);

    const admin = useContext(AdminContext);
    const showToast = useContext(ToastContext);

    const {
        isOpen: isTourOpen,
        currentStep: currentTourStep,
        setCurrentStep: setCurrentTourStep,
        setSteps: setTourSteps,
    } = useTour();

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

    const handleAlumnQuerySearchModalClose = () => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        setShowAlumnQuerySearchModal(false);
    };

    const handleAddAlumnModalClose = () => {
        setShowAddAlumnModal(false);
        setAddAlumnDisplayName("");
        setDuplicateDisplayNameError("");
    };

    const handleAddDropdownMenuStep = (show) => {
        setPreviousTourStep(currentTourStep);

        if (isTourOpen && show) {
            setTimeout(() => {
                setTourSteps(ADD_RESEARCHER_DROPDOWN_MENU_STEPS);
                setCurrentTourStep(0);
            }, 100);
        } else {
            setTourSteps(ADD_RESEARCHER_INITIAL_STEPS);
            setCurrentTourStep(previousTourStep);
        }
    };

    const handleAutoTourNextStep = () => {
        if (isTourOpen) {
            setCurrentTourStep(currentTourStep + 1);
        }
    };

    const handleAlumnQuerySearchModalCancel = () => {
        handleAlumnQuerySearchModalClose();
        handleChangeSteps(ADD_RESEARCHER_INITIAL_STEPS, 3, false);
    };

    const handleAddAlumnModalCancel = () => {
        handleAddAlumnModalClose();
        handleChangeSteps(ADD_RESEARCHER_INITIAL_STEPS, 3, false);
    };

    const handleContinue = () => {
        handleAlumnQuerySearchModalClose();
        setShowAddAlumnModal(true);
        handleChangeSteps(ADD_RESEARCHER_MODAL_STEPS, 0, true);
    };

    const searchAlumn = async (alumnNameQuery) => {
        setShowAlumnQuerySearchModal(true);
        setIsLoading(true);
        handleChangeSteps(QUERY_RESULTS_MODAL_STEPS, 0, true);

        try {
            const res = await fetchAlumnNameQuerySearchResults(
                alumnNameQuery,
                abortControllerRef.current.signal
            );

            if (!res.ok) throw res;

            const alumnNameQueryResults = await res.json();

            setAlumnQueryResults(alumnNameQueryResults);
        } catch (err) {
            if (err.name === "AbortError") {
                console.error(err);
            } else {
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const initializeEventSource = (job_id, full_name) => {
        const es = streamJob(job_id, "index");

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
                        newMap.delete(full_name);
                        return newMap;
                    });

                    break;

                case "working":
                    setProgressMap((prevMap) => {
                        const newMap = new Map(prevMap);
                        newMap.set(full_name, {
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
                        newMap.set(full_name, {
                            status: jobStatus,
                            percentage: 0,
                        });
                        return newMap;
                    });
                    break;

                default:
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
            setEventSourceMap((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.delete(job_id);
                return newMap;
            });
        };
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

            const { job_id, alumn_id, full_name, search_query } =
                alumnsResponse;

            const newArray = [
                ...alumns,
                {
                    alumn_id: alumn_id,
                    full_name: full_name,
                    search_query: search_query,
                },
            ];

            setAlumns(newArray);
            setProgressMap((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(full_name, {});
                return newMap;
            });
            handleItemClick(alumn_id, full_name);
            handleAddAlumnModalClose();

            initializeEventSource(job_id, full_name);
        } catch (error) {
            let errorResponse = await error.json();
            console.error(errorResponse);
            setDuplicateDisplayNameError(errorResponse);
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
            eventSourceMap.forEach((connection, key) => {
                connection.close();
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="add-alumns">
            <h1 className="text-center m-2" data-tour="add-alumns-header-tour">
                Add Researcher
            </h1>
            <NewAlumnForm
                handleAddDropdownMenuStep={handleAddDropdownMenuStep}
                handleAutoTourNextStep={handleAutoTourNextStep}
                searchAlumn={searchAlumn}
            />
            {/* Alumn Query Search Modal BEGINS*/}
            <ConfirmationModal
                dataTour="query-results-modal"
                show={showAlumnQuerySearchModal}
                title="Query Results"
                body={
                    isLoading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: "128px" }}
                        >
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
                    )
                }
                confirmText="Continue"
                onConfirm={handleContinue}
                onCancel={handleAlumnQuerySearchModalCancel}
                disableConfirm={isResultCountZero || isLoading}
            />
            {/* Alumn Query Search Modal ENDS*/}
            {/* Add Alumn Modal BEGINS*/}
            <Form>
                <ConfirmationModal
                    dataTour="add-researcher-modal"
                    show={showAddAlumnModal}
                    title="Add Researcher"
                    body={
                        <Container className="p-0">
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
                                        onChange={({
                                            target: { name, value },
                                        }) => setAddAlumnDisplayName(value)}
                                    />
                                    <Form.Text className="text-muted">
                                        This is the name that will be displayed
                                        in your graph. We suggest entering the
                                        researcher's full name.
                                    </Form.Text>
                                    {duplicateDisplayNameError.error ? (
                                        duplicateDisplayNameError.error.map(
                                            (val) => (
                                                <Form.Text className="text-danger">
                                                    <br />
                                                    {val}
                                                </Form.Text>
                                            )
                                        )
                                    ) : (
                                        <></>
                                    )}
                                </Col>
                            </Form.Group>
                        </Container>
                    }
                    confirmText="Save"
                    onConfirm={addAlumn}
                    onCancel={handleAddAlumnModalCancel}
                    disableCancel={isSaving}
                    disableConfirm={addAlumnDisplayName.length === 0}
                    isConfirming={isSaving}
                />
            </Form>
            {/* Add Alumn Modal ENDS*/}
        </div>
    );
}

export default AddAlumnsController;
