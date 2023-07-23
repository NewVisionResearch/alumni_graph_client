import { useState } from "react";
import { Button, Form, Dropdown, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NewAlumnForm({ submitInput, handleModalShow, setAlumnQueryResults }) {
    const baseUrl = process.env.REACT_APP_BASE_URL;

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
                    setAlumnNameQuery((prev) => `${prev} ${alumnName.trim()}[Author]`);
                }
            } else {
                setAlumnNameQuery((prev) =>
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
                (prev) => `(${prev}) ${newQueryBooleanType} (${alumnName.trim()}[Author])`
            );
            setAlumnName("");
        }
    };

    const searchAlumn = (alumnNameQuery) => {
        const token = localStorage.getItem("jwt");

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        fetch(`${baseUrl}/alumns/${alumnNameQuery}/search`, options)
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then((res) => {
                handleModalShow(true);
                setAlumnQueryResults(res);
            })
            .catch((err) => {
                console.error(err);
                navigate("/error");
            });
    };

    const submitAlumnNameQuery = (e) => {
        const addInput = document.getElementById("addInput");
        const queryInput = document.getElementById("queryInput");

        addInput.setCustomValidity("");

        if (alumnNameQuery !== undefined && alumnNameQuery !== "") {
            searchAlumn(alumnNameQuery);
            setAlumnName("");
            queryInput.setCustomValidity("");
        } else {
            queryInput.setCustomValidity("Please enter a value");
        }
    };

    return (
        <Form
            className="d-flex"
            id="searchForm"
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <div style={{ width: "300px" }}>
                <Form.Control
                    id="addInput"
                    className="input"
                    type="text"
                    value={alumnName}
                    placeholder="Enter an author's name"
                    onChange={(e) => handleInputOnChange(e, setAlumnName)}
                />
                <Form.Control
                    id="queryInput"
                    className="input"
                    type="text"
                    value={alumnNameQuery}
                    placeholder="Enter or edit query for author's name"
                    onChange={(e) => handleInputOnChange(e, setAlumnNameQuery)}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Dropdown as={ButtonGroup}>
                    <Button variant="primary" type="button" onClick={appendToQuery}>
                        {queryBooleanType}
                    </Button>
                    <Dropdown.Toggle
                        title="Boolean Selector"
                        split
                        variant="primary"
                        id="dropdown-split-basic"
                        disabled={queryBooleanType === "Add" ? true : false}
                    />
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleQueryBooleanTypeChange("AND")}>
                            Add with AND
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleQueryBooleanTypeChange("OR")}>
                            Add with OR
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleQueryBooleanTypeChange("NOT")}>
                            Add with NOT
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="primary" type="submit" onClick={submitAlumnNameQuery}>
                    Search
                </Button>
            </div>
        </Form>
    );
}

export default NewAlumnForm;
