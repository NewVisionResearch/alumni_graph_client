import { Form, InputGroup } from 'react-bootstrap';

export default function Input({ id = '', className = 'input', callback, type = 'text', placeholder = '', propsValue = '', isPlainTextAndReadOnly }) {

    return (
        <InputGroup>
            <Form.Control
                id={id}
                className={className}
                type={type}
                value={propsValue}
                readOnly={isPlainTextAndReadOnly}
                placeholder={placeholder}
                onChange={({ target: { value } }) => callback(value)}
                plaintext={isPlainTextAndReadOnly}
            />
        </InputGroup>
    );
}