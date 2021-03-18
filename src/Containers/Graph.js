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
                nodes: uniqueIds(publications).map(alumn => ({ id: multiLine(alumn.display_name), alumn_id: alumn.id })),
                links: createPairs(publications)
                    .map(arr => ({
                        source: multiLine(arr[0].display_name),
                        target: multiLine(arr[1].display_name)
                    }))
            };

            function multiLine(name) {
                return name.split(" ").join("\n")
            }

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
                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'turquoise';
                    ctx.fillText(multiLine(label), node.x, node.y);

                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                })
                .linkColor(link => 'rgb(73, 50, 123)')
                .nodeRelSize(15)
                .backgroundColor('rgb(100, 100, 100)')
                .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
                .onNodeClick((node) => {
                    setAlumnId(node.alumn_id)
                    Graph.centerAt(node.x, node.y, 1000);
                    Graph.zoom(5, 1000)
                })
                .onNodeDragEnd(node => {
                    node.fx = node.x;
                    node.fy = node.y;
                });

            Graph.d3Force('charge').strength(-500);

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
                    id="alumnShow"
                    className="mt-3 mr-3"
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '400px',
                        height: '400px',
                        zIndex: 1000,
                        background: 'rgb(255, 255, 255)',
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
