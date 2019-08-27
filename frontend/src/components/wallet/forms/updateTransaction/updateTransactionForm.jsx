import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const UpdateTransactionForm = props => {
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
                                checked={props.initialValues.transactionType === 'B'}
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
                                checked={props.initialValues.transactionType === 'S'}
                                required
                            />
                        </div>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label>Quotas</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            defaultValue={props.initialValues.quotas}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Quotas is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Form.Row>

            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            defaultValue={props.initialValues.price}
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
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Taxes is a required field!
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Form.Row>

            <Button type="submit">Create</Button>
        </Form>
    );
};

export default UpdateTransactionForm;