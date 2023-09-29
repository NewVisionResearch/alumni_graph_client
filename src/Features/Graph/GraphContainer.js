function GraphContainer({ headerMode, impactMode }) {
    return (
        <div
            id="graph"
            style={{
                border: impactMode ? "3px solid" : "none",
                width: "100vw",
                height:
                    headerMode && !impactMode ? "calc(100vh - 104px)" : "100vh",
                boxSizing: "border-box",
            }}
        ></div>
    );
}

export default GraphContainer;
