import { useState } from "react";
import { Button, Form, Dropdown, ButtonGroup, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { fetchAlumnNameQuerySearchResults } from "../../../../services/api";

function NewAlumnForm({
    handleModalShow,
    setAlumnQueryResults,
    setIsLoading,
    signal,
}) {
    const navigate = useNavigate();

    const [alumnName, setAlumnName] = useState("");
    const [alumnNameQuery, setAlumnNameQuery] = useState("");
    const [queryBooleanType, setQueryBooleanType] = useState("Add");

    const handleInputOnChange = (e, setCallback) => {
        e.target.setCustomValidity("");
        setCallback(e.target.value);

        if (e.target.id === "queryInput" && e.target.value === "") {
            setQueryBooleanType("Add");
        } else if (e.target.id === "queryInput") {
            setQueryBooleanType("AND");
        }
    };

    const appendToQuery = (e) => {
        const addInput = document.getElementById("addInput");

        if (alumnName !== undefined && alumnName !== "") {
            if (queryBooleanType === "Add") {
                if (alumnNameQuery === "") {
                    setAlumnNameQuery(`${alumnName.trim()}[Author]`);
                    setQueryBooleanType("AND");
                } else {
                    setAlumnNameQuery(
                        (prev) => `${prev} ${alumnName.trim()}[Author]`
                    );
                }
            } else {
                setAlumnNameQuery(
                    (prev) =>
                        `(${prev}) ${queryBooleanType} (${alumnName.trim()}[Author])`
                );
            }

            setAlumnName("");
            addInput.setCustomValidity("");
        } else {
            addInput.setCustomValidity("Please enter a value.");
        }

        addInput.reportValidity();
    };

    const handleQueryBooleanTypeChange = (newQueryBooleanType) => {
        setQueryBooleanType(newQueryBooleanType);

        if (alumnName !== undefined && alumnName !== "") {
            setAlumnNameQuery(
                (prev) =>
                    `(${prev}) ${newQueryBooleanType} (${alumnName.trim()}[Author])`
            );
            setAlumnName("");
        }
    };

    const searchAlumn = async (alumnNameQuery) => {
        handleModalShow();
        setIsLoading(true);

        try {
            const res = await fetchAlumnNameQuerySearchResults(
                alumnNameQuery,
                signal
            );

            if (!res.ok) throw res;

            const alumnNameQueryResults = await res.json();

            setAlumnQueryResults(alumnNameQueryResults);
        } catch (err) {
            if (err.name === "AbortError") {
                console.error(err);
            } else {
                console.error(err);
                navigate("/error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const submitAlumnNameQuery = () => {
        const addInput = document.getElementById("addInput");
        const queryInput = document.getElementById("queryInput");

        addInput.setCustomValidity("");

        if (alumnNameQuery !== undefined && alumnNameQuery !== "") {
            searchAlumn(
                encodeURIComponent(alumnNameQuery.replace(/\./g, "%2E"))
            );
            setAlumnName("");
            queryInput.setCustomValidity("");
        } else {
            queryInput.setCustomValidity("Please enter a value");
        }
    };

    return (
        <Form
            id="searchForm"
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <Row className="flex-nowrap">
                <Col xs={8} sm={8}>
                    <Form.Control
                        id="addInput"
                        className="m-2"
                        type="text"
                        value={alumnName}
                        placeholder="Enter an author's name"
                        onChange={(e) => handleInputOnChange(e, setAlumnName)}
                    />
                    <Form.Control
                        id="queryInput"
                        className="m-2"
                        type="text"
                        value={alumnNameQuery}
                        placeholder="Enter or edit query for author's name"
                        onChange={(e) =>
                            handleInputOnChange(e, setAlumnNameQuery)
                        }
                    />
                </Col>
                <Col xs={4} sm={4}>
                    <div className="d-flex flex-column">
                        <Dropdown
                            as={ButtonGroup}
                            className="mt-2 mr-2 mb-1 ml-2"
                        >
                            <Button
                                className="button"
                                type="button"
                                onClick={appendToQuery}
                            >
                                {queryBooleanType}
                            </Button>
                            <Dropdown.Toggle
                                className="button"
                                title="Boolean Selector"
                                split
                                id="dropdown-split-basic"
                                disabled={
                                    queryBooleanType === "Add" ? true : false
                                }
                            />
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() =>
                                        handleQueryBooleanTypeChange("AND")
                                    }
                                >
                                    Add with AND
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() =>
                                        handleQueryBooleanTypeChange("OR")
                                    }
                                >
                                    Add with OR
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() =>
                                        handleQueryBooleanTypeChange("NOT")
                                    }
                                >
                                    Add with NOT
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button
                            className="button mx-2 mt-1"
                            type="submit"
                            onClick={submitAlumnNameQuery}
                        >
                            Search
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
}

export default NewAlumnForm;
