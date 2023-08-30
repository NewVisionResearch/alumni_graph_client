import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Input from '../Components/Input'
function NewAlumnForm({ submitInput }) {

    const [alumnName, setAlumnName] = useState("")

    async function submit() {
        await submitInput(alumnName)
        setAlumnName("")
    }


    return (
        <Form
            className="d-flex"
            onSubmit={(e) => {
                e.preventDefault()
                submit()
            }}
        >
            <div style={{ width: "300px" }}>
                <Input callback={setAlumnName} propsValue={alumnName} />
            </div>
            <Button variant="primary" type="submit">Submit</Button>
        </Form >
    )
}

export default NewAlumnForm