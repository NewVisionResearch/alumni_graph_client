import { useState, useEffect } from 'react'
import ForceGraph from 'force-graph';
import AlumnGraphShow from '../Components/AlumnGraphShow'

function Graph({ aspectRatio }) {
    const baseUrl = process.env.REACT_APP_BASE_URL

    const [stateGraph, setStateGraph] = useState({ create: () => { } })
    const [publications, setPublications] = useState([])
    const [alumnId, setAlumnId] = useState(null)
    const [gData, setGData] = useState({ nodes: [], links: [] })

    useEffect(() => {
        const elem = document.getElementById('graph');

        if (elem) {
            const Graph = ForceGraph()(elem)
            setStateGraph({ create: Graph })
        }
    }, [])

    useEffect(() => {
        let isMounted = true
        if (!publications.length && isMounted) {
            fetch(`${baseUrl}/graphs`)
                .then(res => res.json())
                .then(publications => setPublications(publications))
        }
        return () => { isMounted = false }
    }, [publications.length, baseUrl])

    useEffect(() => {

        if (!gData.length) {

            function uniqueIds(array) {
                array = array.map(p => (p.joins.map(j => j))).flat()
                let obj = {}
                for (let i = 0; i < array.length; i++) {
                    if (!array[i]) continue
                    if (obj[array[i].display_name]) {
                        continue
                    } else {
                        obj[array[i].display_name] = array[i]
                    }
                }

                return Object.values(obj)
            }

            function createPairs(array) {
                let resArray = []
                let obj = {}
                array = array.map(obj => obj.joins)

                for (let i = 0; i < array.length; i++) {
                    for (let j = 0; j < array[i].length; j++) {
                        if (!array[i][j]) continue
                        obj[array[i][j].display_name] = obj[array[i][j].display_name] || []
                        for (let k = 0; k < array[i].length; k++) {
                            if (!array[i][k]) continue
                            if (array[i][j].display_name === array[i][k].display_name) {
                                continue
                            }
                            if (obj[array[i][j].display_name].includes(array[i][k].display_name)) {
                                continue
                            } else {
                                obj[array[i][j].display_name].push(array[i][k].display_name)
                                resArray.push([array[i][j], array[i][k]])
                            }
                        }
                    }
                }

                return resArray
            }
            const data = {
                nodes: uniqueIds(publications).map(alumn => ({ id: alumn.display_name, alumn_id: alumn.id })),
                links: createPairs(publications)
                    .map(arr => ({
                        source: arr[0].display_name,
                        target: arr[1].display_name
                    }))
            };

            setGData(data)
        }

    }, [publications, gData.length])

    useEffect(() => {
        let len = gData.nodes.length
        if (len) {
            const elem = document.getElementById('graph');
            let graphWidth = elem.clientWidth
            let graphHeight = elem.clientHeight

            stateGraph.create && stateGraph.create
                .graphData(gData)
                .nodeCanvasObject((node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 10;

                    ctx.font = `${fontSize}px Sans-Serif`;
                    // const textWidth = ctx.measureText(label).width;

                    // TODO: replace 80 with textWidth if necessary
                    const bckgDimensions = [80, fontSize].map(n => n + fontSize * 0.5); // some padding


                    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                    ctx.beginPath();
                    // TODO: replace 80 with textWidth if necessary
                    ctx.arc(node.x, node.y, (80 / fontSize) * 4.25, 0, 2 * Math.PI, false);
                    ctx.fill();

                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'rgb(77, 172, 147)';
                    ctx.stroke();

                    ctx.textAlign = 'center';

                    ctx.fillStyle = 'rgb(77, 172, 147)';
                    let splitLabel = label.split(" ")
                    let n = splitLabel.length
                    let height = (ctx.measureText(label).fontBoundingBoxAscent + ctx.measureText(label).fontBoundingBoxDescent)
                    let start = height * 1.5
                    // determine line height based on number of lines
                    if (n > 2) {
                        ctx.textBaseline = 'top';
                        splitLabel.forEach(l => {
                            ctx.fillText(l, node.x, node.y - start)
                            start -= height * 1.25
                        })
                    } else {
                        ctx.textBaseline = 'bottom';
                        splitLabel.forEach(l => {
                            ctx.fillText(l, node.x, node.y - start + 16)
                            start -= start / 1.25
                        })
                    }

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                })
                .linkColor(link => 'rgb(73, 50, 123)')
                .nodeRelSize(25)
                .backgroundColor('rgb(255, 255, 255)')
                .width(graphWidth)
                .height(graphHeight)
                .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
                .onNodeClick((node) => {
                    setAlumnId(node.alumn_id)

                    stateGraph.create.centerAt((window.innerWidth <= 425 ? node.x : node.x + 75), (window.innerWidth <= 425 ? node.y + 25 : node.y), 1000);
                    stateGraph.create.zoom(decideZoomOnClick(), 1000)
                })
                .onNodeDragEnd(node => {
                    node.fx = node.x;
                    node.fy = node.y;
                })
                .zoom(0.55, 500)
                .dagMode('radialout')
                .onDagError(() => { })
            // .centerAt(750, 0, 1000)

            if (stateGraph.create) {
                stateGraph.create.d3Force('charge').strength(-7500);
                stateGraph.create.d3Force('center').x(0).y(-40) //.strength(0.05)
                // stateGraph.d3Force('link')
                stateGraph.create.d3Force('gravity')

            }

            function decideZoomOnClick() {
                let width = window.innerWidth
                if (width < 425) {
                    return 1.5
                } else if (width < 825) {
                    return 2
                }
                return 2.25
            }

        }
    }, [aspectRatio, gData, stateGraph.create])

    const closeModal = () => {
        setAlumnId(null)
        stateGraph.create.centerAt(0, -40, 1000);
        stateGraph.create.zoom(0.55, 1000)
    }

    return (
        <div
            className="d-flex justify-content-center"
            style={{ height: '100%', width: '100%', position: 'relative' }}>
            <div
                id="graph"
                style={{ border: '3px solid', width: '100%', height: '100%' }}>
            </div>
            {alumnId ?
                <div
                    id="alumn-graph-show"
                    className="mt-3 mr-3 rounded d-flex-column justify-content-center align-items-center"
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        background: 'rgb(255, 255, 255)',
                        boxShadow: '-7px 10px 20px rgb(31, 31, 31)',
                        overflowY: 'scroll'
                    }}>
                    <AlumnGraphShow alumnId={alumnId} closeModal={closeModal} />
                </div>
                : null
            }
        </div >
    )
}

export default Graph
