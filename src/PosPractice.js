import React, { Component } from "react";
import Posture from "./Posture";
import { Container, Row, Col } from "react-bootstrap";
import "./PosPractice.css";
class PosPractice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instrumento: null,
        };
        this.selectGuitar = this.selectGuitar.bind(this);
        this.selectViolin = this.selectViolin.bind(this);
    }

    selectGuitar() {
        this.setState({ instrumento: "GUITAR" });
    }
    selectViolin() {
        this.setState({ instrumento: "VIOLIN" });
    }

    render() {
        const images = [
            require("./assets/images/guitarSelect.svg"),
            require("./assets/images/violinSelect.svg"),
        ];
        return (
            <div>
                {this.state.instrumento ? (
                    <Posture instrumento={this.state.instrumento} />
                ) : (
                    <Container fluid>
                        <Row>
                            <div className="header">
                                <h2>¡Escoge tu instrumento!</h2>
                            </div>
                        </Row>

                        <Row>
                            <Col md={{ span: 4, offset: 2 }}>
                                <div className="inselect">
                                    <img
                                        src={images[0]}
                                        alt=""
                                        onClick={this.selectGuitar}
                                    />
                                    <p>Guitarra</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="inselect">
                                    <img
                                        src={images[1]}
                                        alt=""
                                        onClick={this.selectViolin}
                                    />
                                    <p>Violin</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                )}
            </div>
        );
    }
}

export default PosPractice;
