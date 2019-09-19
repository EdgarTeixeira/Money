import React, { useState } from "react";
import MoneyInput from "../moneyInput";
import DateInput from "../dateInput";
import TicketInput from "../ticketInput";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import * as moment from "moment";

const InsertAssetForm = props => {
    const [validated, setValidated] = useState(false);
    const handleSubmit = event => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json"
            };

            const body = {
                ticket: form.elements["ticket"].value,
                asset_name: form.elements["asset_name"].value,
                price: parseFloat(form.elements["price"].value.substr(2)),
                quantity: parseInt(form.elements["quantity"].value),
                transaction_date: moment(
                    form.elements["transaction_date"].value,
                    "MM/DD/YYYY"
                ).format("YYYY-MM-DD"),
                transaction_type: form.elements["transaction_type"].value
            };

            fetch("/wallet/transactions", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            })
                .then(status)
                .then(json)
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });

            props.onSuccessfulSubmit();
        }

        event.preventDefault();
        setValidated(true);

        return false;
    };

    return (
        <Form
            method={props.method}
            action={props.action}
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="assetTicket">Ticket</Form.Label>
                        <TicketInput
                            id="assetTicket"
                            name="ticket"
                            placeholder="Asset Ticket"
                            initialValue={props.initialTicketValue}
                        />
                        <Form.Control.Feedback type="invalid">
                            Ticket is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="quantity">Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            defaultValue="1"
                            id="quantity"
                            name="quantity"
                            placeholder="0"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Quantity is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="assetName"
                            name="asset_name"
                        />
                    </Form.Group>
                </Col>
            </Form.Row>

            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <MoneyInput
                            id="price"
                            name="price"
                            placeholder="R$ 0.00"
                        />
                        <Form.Control.Feedback type="invalid">
                            Price is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="transactionDate">
                            Transaction Date
                        </Form.Label>
                        <DateInput
                            id="transactionDate"
                            placeholder="mm/dd/yyyy"
                            name="transaction_date"
                        />
                        <Form.Control.Feedback type="invalid">
                            Transaction Date is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="taxes">
                            Taxas + Emolumentos
                        </Form.Label>
                        <MoneyInput
                            id="taxes"
                            placeholder="R$ 0.00"
                            name="taxes"
                        />
                        <Form.Control.Feedback type="invalid">
                            Taxas + Emolumentos is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Form.Row>

            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="transactionType">
                            Transaction Type
                        </Form.Label>
                        <div>
                            <Form.Check
                                custom
                                inline
                                type="radio"
                                name="transaction_type"
                                id="inlineRadio1"
                                value="B"
                                label="Buy"
                                required
                            />

                            <Form.Check
                                custom
                                inline
                                type="radio"
                                name="transaction_type"
                                id="inlineRadio2"
                                value="S"
                                label="Sell"
                                required
                            />
                        </div>
                        <Form.Control.Feedback type="invalid">
                            Transaction Type is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Form.Row>

            <Button type="submit">Create</Button>
        </Form>
    );
};

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function json(response) {
    return response.json();
}

export default InsertAssetForm;
