import Legend from "./Legend/Legend";

function GraphContainer({ headerMode, impactMode, children }) {
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
        >
            <Legend></Legend>
            {children}
        </div>
    );
}

export default GraphContainer;
