import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const InsertEvenrtForm = props => {
    const [validated, setValidated] = useState(false);
    const handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    const [hideSplit, setHideSplit] = useState(false);
    const handleEventTypeSelection = (event) => {
        console.log(event);
        console.log('Current Target', event.currentTarget);
        console.log('Target', event.target);
    }

    return (
        <Form
            method={props.method}
            action={props.action}
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <Form.Label>Event Type</Form.Label>
                <Form.Control as="select" onChange={handleEventTypeSelection}>
                    <option>Split</option>
                    <option>Unitization</option>
                </Form.Control>
            </Form.Group>

            <div hidden={hideSplit}>
                <h3>Split</h3>
                <Form.Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Asset</Form.Label>
                            <Form.Control as="select">
                                <option>BIDI11</option>
                                <option>SUZB3</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Label>Ratio</Form.Label>
                            <Form.Control
                                type="number"
                                min="2"
                                defaultValue="2"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Quantity is a required field!
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </div>

            <div hidden={!hideSplit}>
                <h3>Unitization</h3>
                <Form.Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Asset</Form.Label>
                            <Form.Control as="select">
                                <option>BIDI11</option>
                                <option>SUZB3</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                defaultValue="1"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Amount is a required field!
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Label>Ratio</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                defaultValue="1"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Ratio is a required field!
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </div>

            <Button type="submit">Create</Button>
        </Form>
    );
};

export default InsertEvenrtForm;
