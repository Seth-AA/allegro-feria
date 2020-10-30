import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Bpm from "./bpm/bpm";
import PosPractice from "./posture/PosPractice";
import StaticPosture from "./posture/StaticPosture";
import Footer from "./Footer";
import Scales from "./libs/Scales";
import Chords from "./libs/Chords";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.style.css";
require("typeface-poppins");

export default function App() {
    return (
        <Router>
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
                        <Nav.Link href="/scales" className="navi">
                            Escalas
                        </Nav.Link>
                        <Nav.Link href="/chords" className="navi">
                            Acordes
                        </Nav.Link>
                        {/* <Nav.Link href="/posture-static" className="navi">
                            Prueba estática
                        </Nav.Link> */}
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
                <Route path="/scales">
                    <Scales />
                </Route>
                <Route path="/chords">
                    <Chords />
                </Route>
                {/* <Route path="/posture-static">
                    <StaticPosture />
                </Route> */}
                <Route path="">
                    <PosPractice />
                </Route>
            </Switch>
            <Footer />
        </Router>
    );
}
