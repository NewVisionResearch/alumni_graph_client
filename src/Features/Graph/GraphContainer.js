function GraphContainer({ impactMode }) {
    return (
        <div
            id="graph"
            style={{
                border: impactMode ? "3px solid" : "none",
                width: "100%",
                height: "100%",
            }}
        ></div>
    );
}

export default GraphContainer;
