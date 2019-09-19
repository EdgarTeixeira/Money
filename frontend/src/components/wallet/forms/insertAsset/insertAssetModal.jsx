import React from "react";
import Modal from "react-bootstrap/Modal";
import InsertAssetForm from "./insertAssetForm";

const InsertAssetModal = props => {
    return (
        <Modal show={props.show} onHide={props.onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Insert New Asset</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InsertAssetForm
                    method={props.method}
                    action={props.action}
                    initialTicketValue={props.initialTicketValue}
                    onSuccessfulSubmit={props.onClose}
                    onUpdate={props.onUpdate}
                />
            </Modal.Body>
        </Modal>
    );
};

export default InsertAssetModal;
