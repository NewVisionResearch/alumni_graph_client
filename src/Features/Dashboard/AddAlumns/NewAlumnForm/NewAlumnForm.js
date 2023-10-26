import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";

function NewAlumnForm({
    handleAddDropdownMenuStep,
    handleAutoTourNextStep,
    searchAlumn,
}) {
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
            handleAutoTourNextStep();
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
            <InputGroup className="mb-2" data-tour="add-input-input-group">
                <Form.Control
                    id="addInput"
                    type="text"
                    value={alumnName}
                    placeholder="Enter an author's name"
                    onChange={(e) => handleInputOnChange(e, setAlumnName)}
                />
                <Dropdown onToggle={(show) => handleAddDropdownMenuStep(show)}>
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
                    <Dropdown.Menu data-tour="add-researcher-dropdown-menu">
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
            <InputGroup data-tour="query-input-input-group">
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
