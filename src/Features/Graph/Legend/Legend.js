import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { AiFillInfoCircle } from "react-icons/ai";

import "./styles/Legend.css";

function Legend() {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            <div className="graph-legend-detailed">
                <div className="legend-item-detailed">
                    <span>Unique Collaborations</span>
                    <div className="legend-detailed-circles">
                        <div className="legend-circle-sm"></div>
                        <div className="legend-circle-md"></div>
                        <div className="legend-circle-lg"></div>
                    </div>
                </div>
                <div class="line-with-arrows">
                    <div class="line-text-left">Less</div>
                    <div class="line"></div>
                    <div class="line-text-right">More</div>
                </div>
                <div className="legend-item-detailed">
                    <span>Collaborations Between Authors</span>
                    <div className="legend-detailed-lines">
                        <div className="legend-line-sm"></div>
                        <div className="legend-line-md"></div>
                        <div className="legend-line-lg"></div>
                    </div>
                </div>
            </div>
        </Tooltip>
    );

    return (
        <div id="graph-legend">
            <div className="legend-header">
                <span>Legend</span>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltip}
                    trigger={["click", "hover", "focus"]}
                >
                    <Button className="button info-button" type="button">
                        <AiFillInfoCircle size={"2em"} />
                    </Button>
                </OverlayTrigger>
            </div>
            <div className="legend-item">
                <div className="legend-circle"></div>
                <span>Researcher</span>
            </div>
            <div className="legend-item">
                <div className="legend-line"></div>
                <span>Publication Collaborations</span>
            </div>
        </div>
    );
}

export default Legend;
