import { useEffect, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap'

export default function Input({ id = '', className = 'input', callback, type = 'text', readOnly = false, placeholder = '', propsValue = '' }) {

    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        if (Array.isArray(propsValue)) {
            setInputValue(propsValue.join(", "))
        } else {
            setInputValue(propsValue)
        }
    }, [propsValue])

    return (
        <InputGroup>
            <Form.Control
                id={id}
                className={className}
                type={type}
                value={inputValue}
                readOnly={readOnly}
                placeholder={placeholder}
                onChange={({ target: { value } }) => callback(value)}
            />
        </InputGroup>
    );
}