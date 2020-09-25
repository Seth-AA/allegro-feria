import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Bpm from "./bpm";
import Posture from "./Posture";
import StaticPosture from "./StaticPosture";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.style.css";
require("typeface-poppins");

export default function App() {
    return (
        <Router>
            <div>
                <Navbar>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto navo">
                            <h2>Allegro Training</h2>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/bpm-finder" className="navi">
                                Ritmo
                            </Nav.Link>
                            <Nav.Link href="/posture-analyzer" className="navi">
                                Postura
                            </Nav.Link>
                            <Nav.Link href="/posture-static" className="navi">
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
