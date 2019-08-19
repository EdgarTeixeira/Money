import React from "react";
import Accordion from "react-bootstrap/Accordion";
import AssetItem from "./assetItem";

const AssetList = props => {
    return (
        <Accordion className="w-75 mx-auto my-2" defaultActiveKey="0">
            <AssetItem
                assetName="Banco Inter"
                assetSymbol="BIDI11"
                currentPrice="18.07"
                quotas={53}
                eventKey="0"
                avgPrice={10.07}
                maxPrice={14.04}
                amountInvested={1000}
            />

            <AssetItem
                assetName="Suzano"
                assetSymbol="SUZB3"
                currentPrice="10.09"
                eventKey="1"
                quotas={10}
                avgPrice={8.05}
                maxPrice={9.95}
                amountInvested={100}
            />
        </Accordion>
    );
};

export default AssetList;
