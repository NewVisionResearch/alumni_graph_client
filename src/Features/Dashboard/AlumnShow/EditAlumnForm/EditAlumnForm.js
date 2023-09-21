import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

function EditAlumnForm({
    submitInput,
    propsValue,
    closeForm,
    editingReseracherError,
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
        >
            <h2 className="text-center m-3">Editing Researcher...</h2>
            <Form.Group>
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
            <Form.Group>
                <Form.Label>Search Query: </Form.Label>
                <Form.Control
                    size="lg"
                    name="search_query"
                    onChange={({ target: { value } }) =>
                        searchNamesChangeHandler(value)
                    }
                    value={alumnInfo.search_query}
                />
            </Form.Group>
            {editingReseracherError ? (
                editingReseracherError.map((val) => (
                    <Form.Text className="text-danger m-1">{val}</Form.Text>
                ))
            ) : (
                <></>
            )}
            <Button
                className="cancel-button m-1"
                size="lg"
                type="button"
                onClick={closeForm}
            >
                Cancel
            </Button>
            <Button
                className="button m-1"
                size="lg"
                type="button"
                onClick={() => submitInput(alumnInfo)}
            >
                Save
            </Button>
        </Form>
    );
}

export default EditAlumnForm;
