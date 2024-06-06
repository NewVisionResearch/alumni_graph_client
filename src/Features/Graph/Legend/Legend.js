import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import { PiCaretDoubleUp, PiCaretDoubleDown } from "react-icons/pi";

import "./styles/Legend.css";

function Legend() {
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);

    const handleLegendOnClick = () => {
        setIsLegendExpanded(!isLegendExpanded);
    };

    return (
        <div
            className={`legend ${
                isLegendExpanded ? "legend-expanded" : "legend-collapsed"
            }`}
        >
            <Button
                className={`legend-button ${
                    isLegendExpanded ? "legend-button-expanded" : ""
                }`}
                type="button"
                variant="light"
                onClick={handleLegendOnClick}
            >
                <div
                    className={`legend-row ${
                        isLegendExpanded ? "legend-row-expanded" : ""
                    }`}
                >
                    <div className="legend-col legend-col-1">
                        <div className="legend-circle"></div>
                    </div>
                    <div className="legend-col legend-col-2">
                        <div className="legend-line"></div>
                    </div>
                    <div className="legend-col legend-col-3">
                        <div className="legend-caret">
                            <Badge bg="secondary">
                                {isLegendExpanded ? (
                                    <PiCaretDoubleDown />
                                ) : (
                                    <PiCaretDoubleUp />
                                )}
                            </Badge>
                        </div>
                    </div>
                </div>
            </Button>
            {isLegendExpanded && (
                <div className="legend-detailed-row">
                    <div className="legend-detailed-col legend-detailed-col-1">
                        <div className="legend-circles">
                            <div className="legend-circle-sm"></div>
                            <div className="legend-circle-md"></div>
                            <div className="legend-circle-lg"></div>
                            <span>Researcher's Unique Collaborations</span>
                        </div>
                    </div>
                    <div className="legend-detailed-col legend-detailed-col-2">
                        <div className="legend-lines">
                            <div className="legend-line-sm"></div>
                            <div className="legend-line-md"></div>
                            <div className="legend-line-lg"></div>
                            <span>Publications Between Authors</span>
                        </div>
                    </div>
                    <div className="legend-detailed-col legend-detailed-col-3">
                        <div class="legend-line-text">Less</div>
                        <div class="legend-line-scale"></div>
                        <div class="legend-line-text">More</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Legend;
