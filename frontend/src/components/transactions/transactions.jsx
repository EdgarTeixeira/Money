import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import TransactionCard from "./transactionCard";

class Transactions extends Component {
    state = {
        transactions: []
    };

    constructor() {
        super();

        fetch("wallet/transactions")
            .then(status)
            .then(json)
            .then(data => {
                this.setState({ transactions: data });
            })
            .catch(error => {
                console.log("ERROR: ", error);
            });
    }

    handleDelete(transactionId) {
        const url = "/wallet/transactions/" + transactionId;
        fetch(url, { method: "DELETE" })
            .then(status)
            .then(json)
            .then(data => {
                let transactions = this.state.transactions.filter(t => {
                    return t.transactionId !== transactionId;
                });

                this.setState({ transactions: transactions });
            })
            .catch(error => {
                console.log("ERROR", error);
            });
    }

    render() {
        return (
            <CardColumns className="mt-5 w-75 mx-auto">
                {this.state.transactions.map((transaction, index) => {
                    return (
                        <TransactionCard
                            transactionId={transaction.transaction_id}
                            assetSymbol={transaction.assetSymbol}
                            assetName={transaction.assetName}
                            quotas={transaction.quotas}
                            transactionType={
                                transaction.transactionType === "B"
                                    ? "BUY"
                                    : "SELL"
                            }
                            price={transaction.price}
                            taxes={transaction.taxes}
                            key={index}
                            onDelete={this.handleDelete}
                        />
                    );
                })}
            </CardColumns>
        );
    }
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function json(response) {
    return response.json();
}

export default Transactions;
