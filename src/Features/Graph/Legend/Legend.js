import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

import { PiCaretDoubleUp, PiCaretDoubleDown } from "react-icons/pi";

import "./styles/Legend.css";

function Legend() {
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);

    const handleLegendOnClick = () => {
        setIsLegendExpanded(!isLegendExpanded);
    };

    return (
        <Container
            fluid
            className={`graph-legend ${
                isLegendExpanded ? "legend-expanded" : "legend-collapse"
            }`}
        >
            <Button
                className={`graph-legend-button ${
                    isLegendExpanded ? "legend-expanded" : ""
                }`}
                type="button"
                variant="light"
                onClick={handleLegendOnClick}
            >
                <Row className="graph-legend-row">
                    <Col xs={7}>
                        <Row className="graph-legend-row">
                            <Container className="legend-circle"></Container>
                            <Container className="legend-line"></Container>
                        </Row>
                    </Col>
                    <Col xs={5}>
                        <Container className="legend-caret">
                            <Badge bg="secondary">
                                {isLegendExpanded ? (
                                    <PiCaretDoubleDown size={"2em"} />
                                ) : (
                                    <PiCaretDoubleUp size={"2em"} />
                                )}
                            </Badge>
                        </Container>
                    </Col>
                </Row>
            </Button>
            {isLegendExpanded && (
                <Row xs className="graph-detailed-legend">
                    <Col xs={7}>
                        <Row className="detailed-legend-circles-and-lines">
                            <Col className="detailed-legend-circles">
                                <Row className="detailed-legend-item">
                                    <Container className="detailed-legend-circle-sm"></Container>
                                    <Container className="detailed-legend-circle-md"></Container>
                                    <Container className="detailed-legend-circle-lg"></Container>
                                    <span>
                                        Researcher's Unique Collaborations
                                    </span>
                                </Row>
                            </Col>
                            <Col className="detailed-legend-lines">
                                <Row className="detailed-legend-item">
                                    <Container className="detailed-legend-line-sm"></Container>
                                    <Container className="detailed-legend-line-md"></Container>
                                    <Container className="detailed-legend-line-lg"></Container>
                                    <span>Publications Between Authors</span>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={5}>
                        <Row className="detailed-legend-item">
                            <div class="line-text">Less</div>
                            <div class="line"></div>
                            <div class="line-text">More</div>
                        </Row>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default Legend;
