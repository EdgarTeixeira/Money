import React from "react";
import TransactionForm from "./transactionForm";

const Wallet = () => {
    return <TransactionForm method="POST" action="/wallet/assets" />;
};

export default Wallet;
