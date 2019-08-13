import React from "react";
import Home from "./home/home";
import Wallet from "./wallet/wallet";
import { Switch, Route } from "react-router-dom";

const Main = () => {
    return (
        <main className="container-fluid">
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/wallet" component={Wallet} />
            </Switch>
        </main>
    );
};

export default Main;
