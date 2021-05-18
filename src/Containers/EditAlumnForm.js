import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Input from '../Components/Input'

function EditAlumnForm({ submitInput, propsValue, closeModal }) {

    const [full_name, search_names] = propsValue

    const [alumnInfo, setAlumnInfo] = useState({ display_name: "", search_names: [] })

    useEffect(() => {
        setAlumnInfo({ display_name: full_name, search_names })
    }, [full_name, search_names])

    const displayNameChangeHandler = (value) => {
        setAlumnInfo({ ...alumnInfo, display_name: value })
    }

    const searchNamesChangeHandler = (value) => {
        setAlumnInfo({ ...alumnInfo, search_names: value.split(", ") })
    }

    return (
        <div className="d-flex">
            <Form
                style={{ position: 'relative' }}
                onSubmit={(e) => {
                    e.preventDefault()
                    submitInput(alumnInfo)
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
                        <Input name="display_name" callback={displayNameChangeHandler} propsValue={alumnInfo.display_name} />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Search Names: </Form.Label>
                        <Input name="search_names" callback={searchNamesChangeHandler} propsValue={alumnInfo.search_names} />
                    </Form.Group>
                </div>
                <Button className="mb-3" variant="info" type="submit" style={{ height: '50px' }}>Edit Alumn</Button>
            </Form>
        </div >
    )
}

export default EditAlumnForm