import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Bpm from "./bpm";
import Posture from "./Posture";
import StaticPosture from "./StaticPosture";
import {
    Navbar,
    NavDropdown,
    Nav,
    Form,
    FormControl,
    Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
    return (
        <Router>
            <div>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src={require("./assets/images/guitar.svg")}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{" "}
                        Allegro
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/bpm-finder">
                                Encuentra el BPM
                            </Nav.Link>
                            <Nav.Link href="/tempo-analyzer">
                                Analiza tu tempo
                            </Nav.Link>
                            <Nav.Link href="/posture-analyzer">
                                Prueba tu postura
                            </Nav.Link>
                            <Nav.Link href="/posture-static">
                                Prueba estática
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route path="/bpm-finder">
                        <Bpm />
                    </Route>
                    <Route path="/tempo-analyzer">
                        <Users />
                    </Route>
                    <Route path="/posture-analyzer">
                        <Posture />
                    </Route>
                    <Route path="/posture-static">
                        <StaticPosture />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}
