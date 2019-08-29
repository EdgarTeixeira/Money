import React, { useState } from "react";
import InsertAssetModal from "./forms/insertAsset/insertAssetModal";
import InsertEventModal from "./forms/insertEvent/insertEventModal";
import AssetList from "./asset/assetList";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Wallet = () => {
    // Show Insert Asset Form
    const [showAsset, setShowAsset] = useState(false);
    const handleAssetClose = () => {
        setShowAsset(false);
    };
    const handleAssetShow = () => {
        setShowAsset(true);
    };

    // Show Insert Event Form
    const [showEvent, setShowEvent] = useState(false);
    const handleEventClose = () => {
        setShowEvent(false);
    };
    const handleEventShow = () => {
        setShowEvent(true);
    };

    return (
        <div className="d-flex flex-column">
            <ButtonGroup className="w-75 mx-auto mt-3">
                <Button className="font-weight-bold" onClick={handleAssetShow}>
                    New Application
                </Button>
                <Button
                    className="font-weight-bold"
                    variant="info"
                    onClick={handleEventShow}
                >
                    New Event
                </Button>
            </ButtonGroup>

            <AssetList />

            <InsertAssetModal
                method="POST"
                action="/wallet/assets"
                show={showAsset}
                handleClose={handleAssetClose}
            />

            <InsertEventModal
                method="POST"
                action="/wallet/assets"
                show={showEvent}
                handleClose={handleEventClose}
            />
        </div>
    );
};

export default Wallet;
