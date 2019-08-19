import React, { useState } from "react";
import Form from "react-bootstrap/Form";

const InsertEvenrtForm = props => {
    const [validated, setValidated] = useState(false);
    const handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <Form
            method={props.method}
            action={props.action}
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <div>Hello World</div>
        </Form>
    );
};

export default InsertEvenrtForm;
