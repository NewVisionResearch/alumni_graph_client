import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";

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
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className="m-2"
        >
            <InputGroup className="mb-2">
                <Form.Control
                    id="addInput"
                    type="text"
                    value={alumnName}
                    placeholder="Enter an author's name"
                    onChange={(e) => handleInputOnChange(e, setAlumnName)}
                />
                <Dropdown>
                    <Button
                        className="button"
                        style={{ width: "59px" }}
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
                        disabled={queryBooleanType === "Add" ? true : false}
                    />
                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => handleQueryBooleanTypeChange("AND")}
                        >
                            Add with AND
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => handleQueryBooleanTypeChange("OR")}
                        >
                            Add with OR
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => handleQueryBooleanTypeChange("NOT")}
                        >
                            Add with NOT
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </InputGroup>
            <InputGroup>
                <Form.Control
                    id="queryInput"
                    type="text"
                    value={alumnNameQuery}
                    placeholder="Edit or enter query"
                    onChange={(e) => handleInputOnChange(e, setAlumnNameQuery)}
                />
                <Button
                    className="button"
                    style={{ width: "86.5px" }}
                    type="submit"
                    onClick={submitAlumnNameQuery}
                >
                    Search
                </Button>
            </InputGroup>
        </Form>
    );
}

export default NewAlumnForm;
