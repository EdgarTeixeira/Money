import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import TransactionCard from "./transactionCard";

class Transactions extends Component {
    state = {
        transactions: [
            {
                assetName: "Sinqia",
                assetSymbol: "SQIA3",
                price: 10.13,
                quotas: 10,
                transactionType: "S",
                transaction_id: 10
            }
        ]
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

    handleDelete = transactionId => {
        const url = "/wallet/transactions/" + transactionId;
        fetch(url, { method: "DELETE" })
            .then(status)
            .then(json)
            .then(data => {
                let transactions = this.state.transactions.filter(t => {
                    return t.transaction_id !== transactionId;
                });

                this.setState({ transactions: transactions });
            })
            .catch(error => {
                console.error(error);
            });
    };

    handleUpdate = newTransaction => {
        let updatedTransactions = this.state.transactions.map(item => {
            if (item.transaction_id === newTransaction.transaction_id) {
                return newTransaction;
            }
            return item;
        });

        this.setState({ transactions: updatedTransactions });
    };

    render() {
        return (
            <CardColumns className="mt-5 w-75 mx-auto">
                {this.state.transactions.map(transaction => {
                    return (
                        <TransactionCard
                            transaction={transaction}
                            key={transaction.transaction_id}
                            onDelete={this.handleDelete}
                            onUpdate={this.handleUpdate}
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
