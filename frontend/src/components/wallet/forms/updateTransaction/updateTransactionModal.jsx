import React from "react";
import Modal from "react-bootstrap/Modal";
import UpdateTransactionForm from "./updateTransactionForm";

const UpdateTransactionModal = props => {
    return (
        <Modal show={props.show} onHide={props.onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Insert New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UpdateTransactionForm
                    action={props.action}
                    initialValues={props.initialValues}
                    onSuccessfulSubmit={props.onClose}
                    onUpdate={props.onUpdate}
                />
            </Modal.Body>
        </Modal>
    );
};

export default UpdateTransactionModal;
