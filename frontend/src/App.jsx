import React, { Component } from "react";
import Navbar from "./components/navbar";
import Main from "./components/main";
import * as Resizer from "css-element-queries";

// TODO: https://www.w3schools.com/js/js_ajax_http_response.asp

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <Navbar />
                <Main />
            </React.Fragment>
        );
    }

    componentDidMount() {
        Resizer.ElementQueries.listen();
    }
}

export default App;
