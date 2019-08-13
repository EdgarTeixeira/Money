import React from "react";

const TicketInput = props => {
    return (
        <input
            type="text"
            className="form-control"
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            onInput={formatAssetTicket}
            required
        />
    );
};

function formatAssetTicket(event) {
    const input = document.activeElement.value;
    document.activeElement.value = input.toUpperCase();
}

export default TicketInput;
