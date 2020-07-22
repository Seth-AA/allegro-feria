import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Bpm from "./bpm";
import Posture from "./Posture";
import StaticPosture from "./StaticPosture";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.style.css";

export default function App() {
    return (
        <Router>
            <div>
                <Navbar bg="#dfe6e9" variant="light">
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
                        <Bpm />
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
