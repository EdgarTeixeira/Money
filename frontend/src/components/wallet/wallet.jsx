import React from "react";
import TransactionForm from "./transactionForm";
import AssetItem from "./assetItem";

const Wallet = () => {
    // return <TransactionForm method="POST" action="/wallet/assets" />;
    return (
        <div className="list-group w-50 mx-auto my-3">
            <div className="list-group-item list-group-item-dark">
                <AssetItem
                    assetName="Banco Inter"
                    assetSymbol="BIDI11"
                    currentPrice={50}
                    totalInvested={1000}
                    quotas={53}
                />
            </div>

            <div className="list-group-item list-group-item-dark">
                <AssetItem
                    assetName="Suzano"
                    assetSymbol="SUZB3"
                    currentPrice={30.07}
                    totalInvested={500}
                    quotas={10}
                />
            </div>
        </div>
    );
};

export default Wallet;
