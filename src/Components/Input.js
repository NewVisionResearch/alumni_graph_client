import { useEffect, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap'
function Input({ callback, type = 'text', readOnly = false, placeholder = '', propsValue = '' }) {

    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        if (Array.isArray(propsValue)) {
            setInputValue(propsValue.join(", "))
        } else {
            setInputValue(propsValue)
        }
    }, [propsValue])

    return (
        <InputGroup style={{ width: "300px" }}>
            <Form.Control
                type={type}
                value={inputValue}
                readOnly={readOnly}
                placeholder={placeholder}
                onChange={({ target: { value } }) => callback(value)}
            />
        </InputGroup>
    );
}

export default Input