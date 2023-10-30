import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import ForceGraph from "force-graph";

import GraphAlumnDetailsModalController from "./GraphAlumnDetailsModal/GraphAlumnDetailsModalController";
import SearchBar from "./SearchBar/SearchBar";
import GraphContainer from "./GraphContainer";
import { AdminContext } from "../../Context/AdminContext/AdminContext";
import { decideZoomOnClick } from "../../services/zoom";
import { fetchGraphPublications } from "../../services/api";

import "./styles/Graph.css";

function GraphController({ impactMode }) {
    const admin = useContext(AdminContext);
    const { labId } = useParams();

    const [graphInstance, setGraphInstance] = useState(null);
    const [publications, setPublications] = useState([]);
    const [alumnId, setAlumnId] = useState(null);
    const [gData, setGData] = useState({ nodes: [], links: [] });
    const [isGraphLoading, setIsGraphLoading] = useState(true);

    const headerMode = admin.email !== "";

    useEffect(() => {
        const graphElement = document.getElementById("graph");
        if (graphElement) {
            const graph = ForceGraph()(graphElement);
            setGraphInstance((prev) => (prev = graph));
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const graphElement = document.getElementById("graph");
            if (graphInstance) {
                graphInstance
                    .width(graphElement.clientWidth)
                    .height(graphElement.clientHeight);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [graphInstance]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setIsGraphLoading(true);

        fetchGraphPublications(labId, signal)
            .then((res) => res.json())
            .then((publications) => setPublications(publications))
            .catch((err) => console.error(err))
            .finally(() => setIsGraphLoading(false));

        return () => {
            controller.abort();
        };
    }, [labId]);

    useEffect(() => {
        if (!gData.length) {
            function uniqueIds(array) {
                array = array.map((p) => p.joins.map((j) => j)).flat();
                let obj = {};
                for (let i = 0; i < array.length; i++) {
                    if (!array[i]) continue;
                    if (obj[array[i].display_name]) {
                        continue;
                    } else {
                        obj[array[i].display_name] = array[i];
                    }
                }

                return Object.values(obj);
            }

            function createPairs(array) {
                let resArray = [];
                let obj = {};
                array = array.map((obj) => obj.joins);

                for (let i = 0; i < array.length; i++) {
                    for (let j = 0; j < array[i].length; j++) {
                        if (!array[i][j]) continue;
                        obj[array[i][j].display_name] =
                            obj[array[i][j].display_name] || [];
                        for (let k = 0; k < array[i].length; k++) {
                            if (!array[i][k]) continue;
                            if (
                                array[i][j].display_name ===
                                array[i][k].display_name
                            ) {
                                continue;
                            }
                            if (
                                obj[array[i][j].display_name].includes(
                                    array[i][k].display_name
                                )
                            ) {
                                continue;
                            } else {
                                obj[array[i][j].display_name].push(
                                    array[i][k].display_name
                                );
                                resArray.push([array[i][j], array[i][k]]);
                            }
                        }
                    }
                }

                return resArray;
            }
            const data = {
                nodes: uniqueIds(publications).map((alumn) => ({
                    id: alumn.display_name,
                    alumn_id: alumn.alumn_id,
                })),
                links: createPairs(publications).map((arr) => ({
                    source: arr[0].display_name,
                    target: arr[1].display_name,
                })),
            };

            setGData(data);
        }
    }, [publications, gData.length]);

    useEffect(() => {
        const graphElement = document.getElementById("graph");
        let graphWidth = graphElement.clientWidth;
        let graphHeight = graphElement.clientHeight;

        graphInstance &&
            graphInstance
                .graphData(gData)
                .nodeCanvasObject((node, ctx, globalScale) => {
                    const label = node.id.trim();
                    const fontSize = 10;

                    ctx.font = `${fontSize}px Sans-Serif`;
                    // const textWidth = ctx.measureText(label).width;

                    // TODO: replace 80 with textWidth if necessary
                    const bckgDimensions = [80, fontSize].map(
                        (n) => n + fontSize * 0.5
                    ); // some padding

                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    ctx.beginPath();
                    // TODO: replace 80 with textWidth if necessary
                    ctx.arc(
                        node.x,
                        node.y,
                        (80 / fontSize) * 4.25,
                        0,
                        2 * Math.PI,
                        false
                    );
                    ctx.fill();

                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "rgb(77, 172, 147)";
                    ctx.stroke();

                    ctx.textAlign = "center";

                    ctx.fillStyle = "rgb(77, 172, 147)";
                    let splitLabel = label.split(" ");
                    let n = splitLabel.length;
                    let height =
                        ctx.measureText(label).fontBoundingBoxAscent +
                        ctx.measureText(label).fontBoundingBoxDescent;
                    let start = height * 1.5;
                    // determine line height based on number of lines
                    if (n > 2) {
                        ctx.textBaseline = "top";
                        splitLabel.forEach((l) => {
                            ctx.fillText(l, node.x, node.y - start);
                            start -= height * 1.25;
                        });
                    } else {
                        ctx.textBaseline = "bottom";
                        splitLabel.forEach((l) => {
                            ctx.fillText(l, node.x, node.y - start + 16);
                            start -= start / 1.25;
                        });
                    }

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                })
                .linkColor((link) => "rgb(73, 50, 123)")
                .nodeRelSize(25)
                .backgroundColor("rgb(255, 255, 255)")
                .width(graphWidth)
                .height(graphHeight)
                .onNodeHover(
                    (node) =>
                        (graphElement.style.cursor = node ? "pointer" : null)
                )
                .onNodeClick((node) => {
                    let windowWidth = window.innerWidth;
                    if (windowWidth < 540) {
                        if (graphInstance.zoom && graphInstance.zoom() > 1.25) {
                            graphInstance.centerAt(
                                window.innerWidth <= 425 ? node.x : node.x + 75,
                                window.innerWidth <= 425 ? node.y + 25 : node.y,
                                1000
                            );
                            graphInstance.zoom(decideZoomOnClick(), 1000);
                            setAlumnId(node.alumn_id);
                        }
                        return;
                    }
                    graphInstance.centerAt(
                        window.innerWidth <= 425 ? node.x : node.x + 75,
                        window.innerWidth <= 425 ? node.y + 25 : node.y,
                        1000
                    );
                    graphInstance.zoom(decideZoomOnClick(), 1000);
                    setAlumnId(node.alumn_id);
                })
                .onNodeDragEnd((node) => {
                    node.fx = node.x;
                    node.fy = node.y;
                })
                .zoom(0.55, 500)
                .dagMode("radialout")
                .onDagError(() => {});
        // .centerAt(750, 0, 1000)

        if (graphInstance) {
            graphInstance.d3Force("charge").strength(-7500);
            graphInstance.d3Force("center").x(0).y(-40); //.strength(0.05)
            // graphInstance.d3Force("link");
            graphInstance.d3Force("gravity");
        }
    }, [gData, graphInstance]);

    const closeModal = () => {
        setAlumnId(null);
        graphInstance.centerAt(0, -40, 1000);
        graphInstance.zoom(0.55, 1000);
    };

    return (
        <div
            style={{
                width: "100vw",
                height:
                    headerMode && !impactMode ? "calc(100vh - 104px)" : "100vh",
                position: "relative",
            }}
        >
            {isGraphLoading && (
                <Image
                    src="../NVR1-TC-cropped.png"
                    alt="loading"
                    className="graph-loading-spinner"
                />
            )}
            <GraphContainer headerMode={headerMode} impactMode={impactMode} />
            {alumnId !== null && (
                <GraphAlumnDetailsModalController
                    alumnId={alumnId}
                    closeModal={closeModal}
                />
            )}
            <SearchBar
                graph={graphInstance}
                nodes={gData.nodes}
                setAlumnId={setAlumnId}
            />
            <Nav.Item
                className="nav-item"
                style={{
                    position: "absolute",
                    right: 25,
                    bottom: 25,
                    display:
                        admin.email === "" || impactMode ? "block" : "none",
                }}
            >
                <Link reloadDocument to={"https://newvisionresearch.org"}>
                    <Image
                        style={{
                            width: "5rem",
                            zIndex: 1000,
                        }}
                        src="../NVR1-TC.png"
                        alt="logo"
                        fluid
                    />
                </Link>
            </Nav.Item>
        </div>
    );
}

export default GraphController;
