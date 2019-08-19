import React, { useState } from "react";
import InsertAssetModal from "./forms/insertAsset/insertAssetModal";
import AssetList from "./asset/assetList";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Wallet = () => {
    // Show Insert Asset Form
    const [showCreate, setShowCreate] = useState(false);
    const handleAssetClose = () => {
        setShowCreate(false);
    };
    const handleAssetShow = () => {
        setShowCreate(true);
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
                <Button className="font-weight-bold" variant="info">
                    New Event
                </Button>
            </ButtonGroup>
            <AssetList />

            <InsertAssetModal
                method="POST"
                action="/wallet/assets"
                show={showCreate}
                handleClose={handleAssetClose}
            />
        </div>
    );
};

export default Wallet;
