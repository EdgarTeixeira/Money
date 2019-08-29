import React, { Component } from "react";
import Accordion from "react-bootstrap/Accordion";
import AssetItem from "./assetItem";

class AssetList extends Component {
    state = {
        assets: [
            {
                name: "Banco Inter",
                symbol: "BIDI11",
                price: 18.07,
                quotas: 53,
                avgPrice: 10.07,
                maxPrice: 14.04,
                invested: 1000
            },
            {
                name: "Suzano",
                symbol: "SUZB3",
                price: 10.09,
                quotas: 10,
                avgPrice: 8.05,
                maxPrice: 9.95,
                invested: 100
            }
        ]
    };

    constructor() {
        super();

        fetch("wallet/assets")
            .then(status)
            .then(json)
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log("ERROR:", error);
            });
    }

    render() {
        return (
            <Accordion className="w-75 mx-auto my-2" defaultActiveKey="0">
                {/* TODO: Sort by value (currentPrice * quotas) */}
                {this.state.assets.map((asset, index) => {
                    return (
                        <AssetItem
                            assetName={asset.name}
                            assetSymbol={asset.symbol}
                            currentPrice={asset.price}
                            quotas={asset.quotas}
                            eventKey={index.toString()}
                            avgPrice={asset.avgPrice}
                            maxPrice={asset.maxPrice}
                            amountInvested={asset.invested}
                            key={index}
                        />
                    );
                })}
            </Accordion>
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

export default AssetList;
