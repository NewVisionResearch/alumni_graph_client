import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import ForceGraph2D from "react-force-graph-2d";

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
    const fgRef = useRef(); // Create a ref for accessing the graph component

    const [isGraphLoading, setIsGraphLoading] = useState(true);
    const [publications, setPublications] = useState([]);
    const [gData, setGData] = useState({ nodes: [], links: [] });
    const [alumnId, setAlumnId] = useState(null);
    const [maxCount, setMaxCount] = useState({
        maxUniqueCollaborationCount: 1,
        maxCollaborationCount: 1,
    });
    const [graphDimensions, setGraphDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [isZooming, setIsZooming] = useState(false);

    const headerMode = admin.email !== "";

    useEffect(() => {
        const controller = new AbortController();

        const fetchPublications = async () => {
            setIsGraphLoading(true);

            try {
                const response = await fetchGraphPublications(
                    labId,
                    controller.signal
                );
                const data = await response.json();

                setPublications(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsGraphLoading(false);
            }
        };

        fetchPublications();

        return () => {
            controller.abort();
        };
    }, [labId]);

    function createNodesAndLinks(publications) {
        const authors = new Map(); // Maps display_name to node data
        const collaborations = new Map(); // Maps author pairs to collaboration data

        let nodesAndLinks = {};

        // Process each publication to update authors and collaborations
        publications.forEach((pub) => {
            const { joins } = pub;

            // Create all possible pairs of authors from each publication
            for (let i = 0; i < joins.length; i++) {
                const authorKey = joins[i].display_name;
                if (!authors.has(authorKey)) {
                    authors.set(authorKey, {
                        id: authorKey,
                        alumn_id: joins[i].alumn_id,
                        uniqueCollaborationCount: 0,
                    });
                }

                for (let j = i + 1; j < joins.length; j++) {
                    const authorPairKey = [joins[i].alumn_id, joins[j].alumn_id]
                        .sort((a, b) => a - b)
                        .join("-");
                    const link = [joins[i].display_name, joins[j].display_name]
                        .sort()
                        .join("*");

                    let collab = collaborations.get(authorPairKey) || {
                        link: link,
                        collaborationCount: 0,
                    };

                    collaborations.set(authorPairKey, {
                        ...collab,
                        collaborationCount: collab.collaborationCount + 1,
                    });
                }
            }
        });

        // Convert collaboration data into links and update author counts
        let links = [];
        let sortedCollaborationsbyCount;
        let sortedAuthorsByCount;

        sortedCollaborationsbyCount = new Map(
            [...collaborations].sort(
                (a, b) => a[1].collaborationCount - b[1].collaborationCount
            )
        );

        sortedCollaborationsbyCount.forEach(
            ({ link, collaborationCount }, _pairKey) => {
                const [source, target] = link.split("*");

                links.push({
                    source: source,
                    target: target,
                    collaborationCount: collaborationCount,
                });

                authors.get(source).uniqueCollaborationCount += 1;
                authors.get(target).uniqueCollaborationCount += 1;
            }
        );

        sortedAuthorsByCount = new Map(
            [...authors].sort(
                (a, b) =>
                    a[1].uniqueCollaborationCount -
                    b[1].uniqueCollaborationCount
            )
        );

        setMaxCount({
            maxCollaborationCount: Array.from(
                sortedCollaborationsbyCount.values()
            )[sortedCollaborationsbyCount.size - 1]?.collaborationCount,
            maxUniqueCollaborationCount: Array.from(
                sortedAuthorsByCount.values()
            )[sortedAuthorsByCount.size - 1]?.uniqueCollaborationCount,
        });

        nodesAndLinks = {
            nodes: Array.from(sortedAuthorsByCount.values()),
            links: links,
        };

        return nodesAndLinks;
    }

    // Effect hook to process publications into graph data
    useEffect(() => {
        const data = createNodesAndLinks(publications);

        setGData(data);
    }, [publications]);

    useEffect(() => {
        if (gData) {
            const graphElement = document.getElementById("graph");

            setGraphDimensions({
                width: graphElement.clientWidth,
                height: graphElement.clientHeight,
            });

            const updateDimensions = () => {
                if (graphElement) {
                    setGraphDimensions({
                        width: graphElement.clientWidth,
                        height: graphElement.clientHeight,
                    });
                }
            };

            window.addEventListener("resize", updateDimensions);

            return () => window.removeEventListener("resize", updateDimensions);
        }
    }, [gData]);

    useEffect(() => {
        if (fgRef.current) {
            fgRef.current.d3Force("charge").strength(-2500);
            fgRef.current.d3Force("center").strength(0.05);
            fgRef.current.zoom(1, 2000);
        }
    }, []);

    const handleNodeCanvasObject = (node, ctx, globalScale) => {
        const baseFontSize = 15;
        const baseRadiusSize = 15;

        // Calculate scale adjustments based on globalScale
        const linearScaleAdjustment = (coefficient) =>
            (1 + coefficient / globalScale) / (coefficient + 1); // Decreases as you zoom in

        // Calculate significance adjustment based on uniqueCollaborationCount
        const collaborationAdjustment = (coefficient) =>
            (1 +
                (node.uniqueCollaborationCount /
                    maxCount.maxUniqueCollaborationCount) *
                    coefficient) /
            (coefficient + 1);

        // Adjust font and radius size based on global scale and node significance
        const fontSize =
            baseFontSize *
            linearScaleAdjustment(1) *
            collaborationAdjustment(1); // Adjust font size based on zoom level
        const radius =
            baseRadiusSize *
            linearScaleAdjustment(0.5) *
            collaborationAdjustment(1) *
            3; // Multiplying by 3 for more significant size difference
        node.radius = radius;

        ctx.fillStyle = "rgba(255, 255, 255, .9)"; // Semi-transparent white background for readability
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.strokeStyle = "#00b092"; // NVR Teal
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.fillStyle = "#00b092"; // NVR Teal
        ctx.font = `${fontSize}px Sans-Serif`;

        const label = node.id.trim();
        const splitLabel = label.split(" ");
        const numberOfLines = splitLabel.length;
        const ctxTextMetrics = ctx.measureText("M"); // Measure a sample character for height approximation.
        const lineHeight =
            1.25 *
            (ctxTextMetrics.fontBoundingBoxAscent +
                ctxTextMetrics.fontBoundingBoxDescent);
        const totalHeight = lineHeight * numberOfLines;
        let startY = node.y - totalHeight / 2 + lineHeight / 2; // Start Y position adjusted for centering.

        ctx.textBaseLine = "middle"; // Set baseline to middle, aligning text around its center.
        splitLabel.forEach((line, index) => {
            let yPos = startY + index * lineHeight;
            ctx.fillText(line, node.x, yPos);
        });
    };

    const handleNodeHover = (node) =>
        (document.getElementById("graph").style.cursor = node
            ? "pointer"
            : null);

    const handleNodeClick = (node) => {
        if (!isZooming) {
            fgRef.current.centerAt(
                node.x + (window.innerWidth < 425 ? 0 : 50),
                node.y + (window.innerHeight < 425 ? 25 : 25),
                1000
            );
            fgRef.current.zoom(decideZoomOnClick(), 2000);

            setAlumnId(node.alumn_id);
        }
    };

    const handleZoom = ({ k, x, y }) => {
        setIsZooming(true);
    };

    const handleZoomEnd = ({ k, x, y }) => {
        setIsZooming(false);
    };

    const handleNodeDragEnd = (node) => {
        node.fx = node.x;
        node.fy = node.y;
    };

    const handleNodePointerAreaPaint = (node, color, ctx, _globalScale) => {
        const size = node.radius || 10;

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    };

    const closeModal = useCallback(() => {
        setAlumnId(null);

        if (fgRef.current) {
            fgRef.current.zoom(1, 2000);
            fgRef.current.centerAt(0, 0, 2000);
        }
    }, [fgRef]);

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
            {!isGraphLoading && gData?.links?.length === 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "1.5rem",
                        textAlign: "center",
                        zIndex: 1000,
                    }}
                >
                    {headerMode
                        ? "No collaborations have been recorded for this graph yet. Head to the dashboard to add researchers and start tracking collaborations!"
                        : "No collaborations have been recorded for this graph yet. Check back soon for updates!"}
                </div>
            )}
            <GraphContainer headerMode={headerMode} impactMode={impactMode}>
                <ForceGraph2D
                    id={"graph"}
                    ref={fgRef}
                    graphData={gData}
                    nodeCanvasObject={handleNodeCanvasObject}
                    nodePointerAreaPaint={handleNodePointerAreaPaint}
                    linkColor={(_link) => "#4f2d7f"}
                    linkWidth={(link) =>
                        1 +
                        (link.collaborationCount /
                            maxCount.maxCollaborationCount) *
                            10
                    }
                    onNodeHover={handleNodeHover}
                    onNodeClick={handleNodeClick}
                    onZoom={handleZoom}
                    onZoomEnd={handleZoomEnd}
                    onNodeDragEnd={handleNodeDragEnd}
                    width={graphDimensions.width}
                    height={graphDimensions.height}
                    dagMode="radialout"
                    d3
                />
            </GraphContainer>
            {alumnId !== null && (
                <GraphAlumnDetailsModalController
                    alumnId={alumnId}
                    closeModal={closeModal}
                />
            )}
            <SearchBar
                graph={fgRef.current}
                nodes={gData.nodes}
                setAlumnId={setAlumnId}
            />
            <Nav.Item
                className="nav-item"
                style={{
                    position: "absolute",
                    right: 30,
                    bottom: 30,
                    display: !headerMode || impactMode ? "block" : "none",
                }}
            >
                <Link reloadDocument to={"https://newvisionresearch.org"}>
                    <Image
                        style={{
                            width: "5rem",
                            zIndex: 1,
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
