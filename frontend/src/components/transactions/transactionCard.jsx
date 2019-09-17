import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import UpdateTransactionModal from "../wallet/forms/updateTransaction/updateTransactionModal";

const TransactionCard = props => {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
    };

    return (
        <Card border="primary">
            <Card.Header>
                <Card.Title>{props.transaction.assetSymbol}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {props.transaction.assetName}
                </Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    Type:{" "}
                    <span className="font-weight-bold">
                        {props.transaction.transactionType === "B"
                            ? "BUY"
                            : "SELL"}
                    </span>
                    <br />
                    Quotas:{" "}
                    <span className="font-weight-bold">
                        {props.transaction.quotas}
                    </span>
                    <br />
                    Price:{" "}
                    <span className="font-weight-bold">
                        R$ {props.transaction.price}
                    </span>
                    <br />
                    Taxes:{" "}
                    <span className="font-weight-bold">
                        R$ {props.transaction.taxes}
                    </span>
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <ButtonGroup>
                    <Button variant="outline-primary" onClick={handleShow}>
                        Edit
                    </Button>
                    <Button
                        variant="outline-danger"
                        onClick={() => {
                            props.onDelete(props.transaction.transaction_id);
                        }}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </Card.Footer>

            <UpdateTransactionModal
                show={show}
                onClose={handleClose}
                onUpdate={props.onUpdate}
                action={
                    "wallet/transactions/" + props.transaction.transaction_id
                }
                initialValues={{
                    quotas: props.transaction.quotas,
                    price: props.transaction.price,
                    taxes: props.transaction.taxes,
                    transactionType: props.transaction.transactionType
                }}
            />
        </Card>
    );
};

export default TransactionCard;
