import React from "react";
import CardColumns from "react-bootstrap/CardColumns";
import TransactionCard from "./transactionCard";

const Transactions = () => {
    return (
        <CardColumns className="mt-5 w-75 mx-auto">
            <TransactionCard
                assetSymbol="BIDI11"
                assetName="Banco Inter"
                quotas={2}
                transactionType="BUY"
                price={10.0}
                taxes={0.01}
            />

            <TransactionCard
                assetSymbol="BIDI11"
                assetName="Banco Inter"
                quotas={5}
                transactionType="SELL"
                price={100.0}
                taxes={0.11}
            />

            <TransactionCard
                assetSymbol="BIDI11"
                assetName="Banco Inter"
                quotas={2}
                transactionType="BUY"
                price={10.0}
                taxes={0.01}
            />

            <TransactionCard
                assetSymbol="BIDI11"
                assetName="Banco Inter"
                quotas={2}
                transactionType="BUY"
                price={10.0}
                taxes={0.01}
            />

            <TransactionCard
                assetSymbol="BIDI11"
                assetName="Banco Inter"
                quotas={2}
                transactionType="BUY"
                price={10.0}
                taxes={0.01}
            />
        </CardColumns>
    );
};

export default Transactions;
