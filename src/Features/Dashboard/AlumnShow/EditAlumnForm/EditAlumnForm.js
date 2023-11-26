import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

function EditAlumnForm({
    submitInput,
    propsValue,
    closeForm,
    editingReseracherError,
    isSavingAlumnEdit,
}) {
    const [full_name, search_query] = propsValue;

    const [alumnInfo, setAlumnInfo] = useState({
        display_name: "",
        search_query: "",
    });

    useEffect(() => {
        setAlumnInfo({ display_name: full_name, search_query });
    }, [full_name, search_query]);

    const displayNameChangeHandler = (value) => {
        setAlumnInfo({ ...alumnInfo, display_name: value });
    };

    const searchNamesChangeHandler = (value) => {
        setAlumnInfo({ ...alumnInfo, search_query: value });
    };

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            data-tour="edit-researcher-form-tour"
        >
            <h2 className="text-center m-3">Editing Researcher...</h2>
            <Form.Group
                className="custom-form-group mx-2"
                data-tour="edit-researcher-display-name-tour"
            >
                <Form.Label>Display Name: </Form.Label>
                <Form.Control
                    size="lg"
                    name="display_name"
                    onChange={({ target: { value } }) =>
                        displayNameChangeHandler(value)
                    }
                    value={alumnInfo.display_name}
                />
            </Form.Group>
            <Form.Group
                className="custom-form-group mx-2"
                data-tour="edit-researcher-search-query-tour"
            >
                <Form.Label>Search Query: </Form.Label>
                <Form.Control
                    size="lg"
                    name="search_query"
                    onChange={({ target: { value } }) =>
                        searchNamesChangeHandler(value)
                    }
                    value={alumnInfo.search_query}
                />
                {editingReseracherError ? (
                    editingReseracherError.map((val) => (
                        <Form.Text className="text-danger mt-4">
                            {val}
                        </Form.Text>
                    ))
                ) : (
                    <></>
                )}
            </Form.Group>
            <ButtonToolbar data-tour="edit-researcher-button-tour">
                <Button
                    className="cancel-button m-2"
                    size="lg"
                    type="button"
                    onClick={closeForm}
                    disabled={isSavingAlumnEdit}
                >
                    Cancel
                </Button>
                <Button
                    className="button m-2"
                    size="lg"
                    type="button"
                    onClick={() => submitInput(alumnInfo)}
                    disabled={isSavingAlumnEdit}
                >
                    {isSavingAlumnEdit ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            {" Saving"}
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </ButtonToolbar>
        </Form>
    );
}

export default EditAlumnForm;
