import React from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AssetItem = props => {
    return (
        <Card border="primary">
            <Accordion.Toggle as={Card.Header} eventKey={props.eventKey}>
                <Row>
                    <Col sm={10}>
                        <h2>{props.assetName}</h2>
                        <h4 className="font-weight-normal">
                            {props.assetSymbol}
                        </h4>
                        <h5 className="font-weight-normal">
                            R$ {props.currentPrice}
                        </h5>
                    </Col>
                    <Col sm={2} className="align-self-center">
                        <h2 className="text-center">
                            {getRentability(
                                props.amountInvested,
                                props.quotas * props.currentPrice
                            )}
                            %
                        </h2>
                    </Col>
                </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.eventKey}>
                <Card.Body>
                    <Row>
                        <Col className="align-self-center">
                            <p>
                                Quotas:{" "}
                                <span className="font-weight-bold">
                                    {props.quotas}
                                </span>
                                <br className="mb-1" />
                                Avg Price:{" "}
                                <span className="font-weight-bold">
                                    R$ {props.avgPrice}
                                </span>
                                <br className="mb-1" />
                                Max Price:{" "}
                                <span className="font-weight-bold">
                                    R$ {props.maxPrice}
                                </span>
                            </p>
                        </Col>
                        <Col className="align-self-center">
                            <p>
                                Total Investido:{" "}
                                <span className="font-weight-bold">
                                    R$ {props.amountInvested}
                                </span>
                                <br className="mb-1" />
                                Valor Atual:{" "}
                                <span className="font-weight-bold">
                                    R$ {props.quotas * props.currentPrice}
                                </span>
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
};

function getRentability(invested, current) {
    return ((current - invested) / invested).toFixed(2);
}

export default AssetItem;
