import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Input from '../Components/Input';

function EditAlumnForm({ submitInput, propsValue, closeModal }) {

    const [full_name, search_query] = propsValue;

    const [alumnInfo, setAlumnInfo] = useState({ display_name: "", search_query: "" });

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
        <div className="d-flex">
            <Form
                style={{ position: 'relative' }}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitInput(alumnInfo);
                }}>
                <div style={{ width: '300px' }}>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={closeModal}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <Form.Group>
                        <Form.Label>Full Name: </Form.Label>
                        <Input name="display_name" callback={displayNameChangeHandler} propsValue={alumnInfo.display_name} isPlainTextAndReadOnly={true} />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Search Query: </Form.Label>
                        <Input name="search_query" callback={searchNamesChangeHandler} propsValue={alumnInfo.search_query} isPlainTextAndReadOnly={false} />
                    </Form.Group>
                </div>
                <Button className="mb-3" type="submit" style={{ height: '50px' }}>Edit Researcher</Button>
            </Form>
        </div >
    );
}

export default EditAlumnForm;