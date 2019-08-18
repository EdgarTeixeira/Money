import React from "react";
import TransactionForm from "./transactionForm";
import AssetList from "./asset/assetList";

const Wallet = () => {
    // return <TransactionForm method="POST" action="/wallet/assets" />;
    return (
        <AssetList />
    );
};

export default Wallet;
