import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const UpdateTransactionForm = props => {
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
            // TODO: Add other fields to update
            const body = {
                price: parseFloat(form.elements["price"].value),
                quotas: parseInt(form.elements["quotas"].value)
            };

            fetch(props.action, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(body)
            })
                .then(status)
                .then(json)
                .then(data => {
                    props.onUpdate(data);
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
            action={props.action}
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Transaction Type</Form.Label>
                        <div>
                            <Form.Check
                                custom
                                inline
                                type="radio"
                                name="transaction_type"
                                id="inlineRadio1"
                                value="buy"
                                label="Buy"
                                defaultChecked={
                                    props.initialValues.transactionType === "B"
                                }
                                required
                            />

                            <Form.Check
                                custom
                                inline
                                type="radio"
                                name="transaction_type"
                                id="inlineRadio2"
                                value="sell"
                                label="Sell"
                                defaultChecked={
                                    props.initialValues.transactionType === "S"
                                }
                                required
                            />
                        </div>
                    </Form.Group>
                </Col>
            </Form.Row>

            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            defaultValue={props.initialValues.price}
                            name="price"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Price is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label>Taxes</Form.Label>
                        <Form.Control
                            defaultValue={props.initialValues.taxes}
                            name="taxes"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Taxes is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label>Quotas</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            defaultValue={props.initialValues.quotas}
                            name="quotas"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Quotas is a required field!
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

export default UpdateTransactionForm;
