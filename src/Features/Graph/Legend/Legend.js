import "./styles/Legend.css";

function Legend() {
    return (
        <div id="graph-legend">
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
