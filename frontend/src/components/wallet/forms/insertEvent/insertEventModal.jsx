import React from "react";
import Modal from "react-bootstrap/Modal";
import InsertEventForm from "./insertEventForm";

const InsertEventModal = props => {
    return (
        <Modal show={props.show} onHide={props.handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Insert New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InsertEventForm method={props.method} action={props.action} />
            </Modal.Body>
        </Modal>
    );
};

export default InsertEventModal;
