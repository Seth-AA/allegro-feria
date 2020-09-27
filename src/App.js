import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Bpm from "./bpm";
import PosPractice from "./PosPractice";
import StaticPosture from "./StaticPosture";
import Footer from "./Footer";
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
                            <img src="/img/allegrowhite.svg" width="50%" />
                        </Nav>
                        <Nav>
                            <Nav.Link href="/posture-analyzer" className="navi">
                                Postura
                            </Nav.Link>
                            <Nav.Link href="/bpm-finder" className="navi">
                                Ritmo
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
                        <PosPractice />
                    </Route>
                    <Route path="/posture-static">
                        <StaticPosture />
                    </Route>
                    <Route path="">
                        <PosPractice />
                    </Route>
                </Switch>
                <Footer />
            </div>
        </Router>
    );
}
