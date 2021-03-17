import { useState, useEffect } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'

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
            inline>
            <InputGroup style={{ minWidth: "300px" }}>
                <FormControl type="text" value={inputVal} onChange={({ target: { value } }) => setInputVal(value)} />
                <InputGroup.Append>
                    <Button
                        variant="info"
                        onClick={(e) => {
                            setInputVal("")
                            submitInput(e, inputVal)
                        }}>Submit</Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    )
}

export default InputBar