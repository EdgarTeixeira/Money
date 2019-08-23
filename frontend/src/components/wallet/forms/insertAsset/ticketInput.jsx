import React from "react";
import Form from "react-bootstrap/Form";

const TicketInput = props => {
    return (
        <Form.Control
            type="text"
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            value={props.initialValue}
            onInput={formatAssetTicket}
            readOnly={wasInitialized(props.initialValue)}
            required
        />
    );
};

function wasInitialized(initialValue) {
    return initialValue !== undefined;
}

function formatAssetTicket(event) {
    const input = document.activeElement.value;
    document.activeElement.value = input.toUpperCase();
}

export default TicketInput;
