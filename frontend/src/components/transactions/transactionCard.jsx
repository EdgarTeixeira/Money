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
                <Card.Title>{props.assetSymbol}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {props.assetName}
                </Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    Type:{" "}
                    <span className="font-weight-bold">
                        {props.transactionType}
                    </span>
                    <br />
                    Quotas:{" "}
                    <span className="font-weight-bold">{props.quotas}</span>
                    <br />
                    Price:{" "}
                    <span className="font-weight-bold">R$ {props.price}</span>
                    <br />
                    Taxes:{" "}
                    <span className="font-weight-bold">R$ {props.taxes}</span>
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
                            props.onDelete(props.transactionId);
                        }}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </Card.Footer>

            <UpdateTransactionModal
                show={show}
                handleClose={handleClose}
                method="PUT"
                action={"wallet/transactions/" + props.transactionId}
                initialValues={{
                    quotas: props.quotas,
                    price: props.price,
                    taxes: props.taxes,
                    transactionType: props.transactionType === "BUY" ? "B" : "S"
                }}
            />
        </Card>
    );
};

export default TransactionCard;
