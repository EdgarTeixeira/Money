import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

class AppNavbar extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Navbar.Brand>Navbar</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/wallet">
                            <Nav.Link>Wallet</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/transactions">
                            <Nav.Link>Transactions</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default AppNavbar;
