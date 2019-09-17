import React, { Component } from "react";
import AppNavbar from "./components/appNavbar";
import Main from "./components/main";
import * as Resizer from "css-element-queries";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <AppNavbar />
                <Main />
            </React.Fragment>
        );
    }

    componentDidMount() {
        Resizer.ElementQueries.listen();
    }
}

export default App;
