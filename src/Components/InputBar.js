import { useState, useEffect } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

function InputBar({ submitInput, _value }) {

    const [inputVal, setInputVal] = useState("")

    useEffect(() => {
        if (_value) {
            setInputVal(_value.join(", "))
        }
    }, [_value])

    return (
        <Form
            style={{ width: "fit-content" }}
            className="d-flex"
            onSubmit={(e) => {
                setInputVal("")
                submitInput(e, inputVal)
            }}
            inline>
            <InputGroup style={{ minWidth: "300px" }}>
                <Form.Control type="text" value={inputVal} onChange={({ target: { value } }) => setInputVal(value)} />
                <InputGroup.Append>
                    <Button
                        variant="info"
                        type="submit"
                    >Submit</Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    )
}

export default InputBar