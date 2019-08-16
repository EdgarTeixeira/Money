import React from "react";

const AssetItem = props => {
    return (
        <div className="row">
            <div className="col-sm-2">
                <p className="font-weight-bold">
                    {props.assetName}
                    <br />
                    <span className="font-weight-bold">
                        {props.assetSymbol + " "}
                    </span>
                    <br />
                    <span className="font-weight-normal">
                        R$ {props.currentPrice}
                    </span>
                </p>
            </div>
            <div className="col-sm-4">
                <p>
                    Quotas:{" "}
                    <span className="font-weight-bold">{props.quotas}</span>
                    <br />
                    Valor Investido:{" "}
                    <span className="font-weight-bold">
                        R$ {props.totalInvested}
                    </span>
                    <br />
                    <span>
                        Valor Atual:{" "}
                        <span className="font-weight-bold">
                            R$ {props.currentPrice * props.quotas}
                        </span>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AssetItem;
