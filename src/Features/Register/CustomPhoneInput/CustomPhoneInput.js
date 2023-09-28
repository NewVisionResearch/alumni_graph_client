import React from "react";
import Form from "react-bootstrap/Form";

const CustomPhoneInput = React.forwardRef((props, ref) => (
    <Form.Control
        {...props}
        ref={ref}
        className="PhoneInputInput"
        type="tel"
        name="phoneNumber"
        required
    ></Form.Control>
));

export default CustomPhoneInput;
