import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ForceGraph from 'force-graph';
import AlumnGraphShow from '../Components/AlumnGraphShow'

function Graph() {

    const [publications, setPublications] = useState([])
    const [alumnId, setAlumnId] = useState(null)
    const [aspectRatio, setAspectRatio] = useState(window.innerHeight * window.innerWidth / 1000000)

    window.addEventListener('resize', () => {
        setAspectRatio(window.innerHeight * window.innerWidth / 10000)
    })

    useEffect(() => {
        if (!publications.length) {
            fetch('http://localhost:3000/api/v1/graphs')
                .then(res => res.json())
                .then(publications => setPublications(publications))
        }
    }, [publications.length])

    useEffect(() => {
        if (publications.length) {
            const gData = {
                nodes: uniqueIds(publications).map(alumn => ({ id: alumn.display_name, alumn_id: alumn.id })),
                links: createPairs(publications)
                    .map(arr => ({
                        source: arr[0].display_name,
                        target: arr[1].display_name
                    }))
            };

            const elem = document.getElementById('graph');
            const Graph = ForceGraph()(elem)
                (document.getElementById('graph'))
                .graphData(gData)
                .nodeCanvasObject((node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 16 / aspectRatio;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.5); // some padding

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, bckgDimensions[0] / 2 - bckgDimensions[1] / 10, 0, 2 * Math.PI, false);
                    ctx.fill();

                    ctx.textAlign = 'center';

                    ctx.fillStyle = 'rgb(77, 172, 147)';
                    let splitLabel = label.split(" ")
                    let n = splitLabel.length
                    let height = (ctx.measureText(label).fontBoundingBoxAscent + ctx.measureText(label).fontBoundingBoxDescent)
                    let start = height * 1.25
                    if (n > 2) {
                        ctx.textBaseline = 'top';
                        splitLabel.forEach(l => {
                            ctx.fillText(l, node.x, node.y - start)
                            start -= height * 1.25
                        })
                    } else {
                        ctx.textBaseline = 'bottom';
                        splitLabel.forEach(l => {
                            ctx.fillText(l, node.x, node.y + start)
                            start -= start
                        })
                    }

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                })
                .linkColor(link => 'rgb(73, 50, 123)')
                .nodeRelSize(15)
                .backgroundColor('rgb(217, 217, 217)')
                .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
                .onNodeClick((node) => {
                    setAlumnId(node.alumn_id)
                    Graph.centerAt(node.x, node.y, 1000);
                    Graph.zoom(5, 1000)
                })
                .onNodeDragEnd(node => {
                    node.fx = node.x;
                    node.fy = node.y;
                })
                .zoom(0.75)
            // .centerAt(200, 100);

            Graph.d3Force('center', null);
            Graph.d3Force('charge').strength(-1000);

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
        }
    }, [publications, aspectRatio])

    const closeModal = () => {
        setAlumnId(null)
    }
    const token = localStorage.getItem("jwt")

    return (
        <div style={{ position: 'relative' }}>
            <div id="graph" style={{ margin: 0, width: '100%' }}></div>
            {alumnId ?
                <div
                    id="alumn-show-graph"
                    className="mt-3 mr-3 rounded"
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '400px',
                        height: '400px',
                        zIndex: 1000,
                        background: 'rgb(255, 255, 255)',
                        boxShadow: '-7px 10px 20px rgb(31, 31, 31)',
                        overflowY: 'scroll'
                    }}>
                    <AlumnGraphShow alumnId={alumnId} closeModal={closeModal} />
                </div>
                : null}
            {
                token ?
                    null :
                    <Link
                        to="/login"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 900
                        }}>
                        Admin Login</Link>
            }
        </div>
    )
}

export default Graph
