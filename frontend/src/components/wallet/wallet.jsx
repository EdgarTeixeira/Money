import React from "react";
import TransactionForm from "./transactionForm";

const Wallet = () => {
    // return <TransactionForm method="POST" action="/wallet/assets" />;
    return (
        <div className="list-group w-75 mx-auto m-3">
            <div className="list-group-item list-group-item-dark">
                <div className="row">
                    <div className="col-sm-2">
                        <p className="font-weight-bold">
                            Banco Inter
                            <br />
                            <p className="font-weight-bold">
                                BIDI11{" "}
                                <span className="font-weight-normal ml-2">
                                    R$64.56
                                </span>
                            </p>
                        </p>
                    </div>
                    <div className="col-sm-2 border-left border-right border-dark">Hello World</div>
                </div>
            </div>

            <div className="list-group-item list-group-item-dark">
                <div className="row">
                    <div className="col-sm-2">
                        <p className="font-weight-bold">
                            Suzano
                            <br />
                            <p className="font-weight-bold">
                                SUZB3{" "}
                                <span className="font-weight-normal ml-2">
                                    R$30.07
                                </span>
                            </p>
                        </p>
                    </div>
                    <div className="col-sm-2 border-left border-right border-dark">Hello World</div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
