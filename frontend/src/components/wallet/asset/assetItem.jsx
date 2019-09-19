import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import InsertAssetModal from "../forms/insertAsset/insertAssetModal";

const AssetItem = props => {
    // Show Insert Asset Form
    const [showAsset, setShowAsset] = useState(false);
    const handleAssetClose = () => {
        setShowAsset(false);
    };
    const handleAssetShow = () => {
        setShowAsset(true);
    };

    // FIXME: Calculo da rentabilidade está incorreto
    return (
        <Card border="primary" className="border-bottom rounded">
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
                        {getRentabilityElement(
                            props.amountInvested,
                            props.quotas * props.currentPrice
                        )}
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
                        <Col
                            sm={2}
                            className="align-self-center d-flex flex-column"
                        >
                            <ButtonGroup vertical>
                                <Button
                                    variant="outline-primary"
                                    className="font-weight-bold"
                                    onClick={handleAssetShow}
                                >
                                    New
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    className="font-weight-bold"
                                >
                                    Edit
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>

                    <InsertAssetModal
                        method="POST"
                        action="/wallet/transactions"
                        show={showAsset}
                        handleClose={handleAssetClose}
                        initialTicketValue={props.assetSymbol}
                    />
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
};

function getRentability(invested, current) {
    return ((current - invested) / invested).toFixed(2);
}

function getRentabilityElement(invested, current) {
    let rentability = getRentability(invested, current);
    let textColor = rentability < 0.0 ? "text-danger" : "text-success";

    return <h2 className={"text-center " + textColor}>{rentability}%</h2>;
}

export default AssetItem;
