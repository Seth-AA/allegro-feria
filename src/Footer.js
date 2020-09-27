import React from "react";

import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import "./fontawesome/css/all.min.css";

function Footer() {
    return (
        <Container fluid>
            <section class="social-media">
                <div class="social-media-wrap">
                    <div class="footer-logo">
                        <img src="img/wings.svg" alt="" />
                    </div>
                    <small class="website-rights">Wings © 2020</small>
                    <div>
                        <div class="social-icons">
                            <a
                                class="social-icon-link facebook"
                                href="https://www.facebook.com/allegro.wings/"
                            >
                                <i class="fab fa-facebook-f" />
                            </a>
                            <a
                                class="social-icon-link instagram"
                                href="https://www.instagram.com/allegro.wings/"
                            >
                                <i class="fab fa-instagram" />
                            </a>
                        </div>
                        <a
                            className="social-link small"
                            href="mailto:allegro.wings@gmail.com"
                        >
                            <i class="fa fa-envelope-o"></i>
                            {""}
                            allegro.wings@gmail.com
                        </a>
                    </div>
                </div>
            </section>
        </Container>
    );
}

export default Footer;
