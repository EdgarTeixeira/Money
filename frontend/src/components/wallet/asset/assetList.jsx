import React, { Component } from "react";
import Accordion from "react-bootstrap/Accordion";
import AssetItem from "./assetItem";

class AssetList extends Component {
    state = {
        assets: []
    };

    constructor() {
        super();
        this.handleUpdate();
    }

    handleUpdate = () => {
        fetch("wallet/assets")
            .then(status)
            .then(json)
            .then(data => {
                this.setState({ assets: data });
            })
            .catch(error => {
                console.log("ERROR:", error);
            });
    };

    render() {
        return (
            <Accordion className="w-75 mx-auto my-2" defaultActiveKey="0">
                {/* TODO: Sort by value (currentPrice * quotas) */}
                {this.state.assets.map((asset, index) => {
                    return (
                        <AssetItem
                            asset={asset}
                            eventKey={index.toString()}
                            onUpdate={this.handleUpdate}
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
