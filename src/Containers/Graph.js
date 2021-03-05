import { useState, useEffect } from 'react'
import ForceGraph3D from '3d-force-graph'
import SpriteText from 'three-spritetext'
import AlumnGraphShow from '../Components/AlumnGraphShow'

function Graph() {

    const [publications, setPublications] = useState([])
    const [alumnId, setAlumnId] = useState(null)

    useEffect(() => {
        fetch('http://localhost:3000/api/v1/graphs')
            .then(res => res.json())
            .then(publications => setPublications(publications))
    }, [])
    console.log(publications)
    useEffect(() => {
        if (publications.length) {
            console.log(publications)
            const gData = {
                nodes: uniqueIds(publications).map(alumn => ({ id: alumn.display_name, alumn_id: alumn.id })),
                links: createPairs(publications)
                    .map(arr => ({
                        source: arr[0].display_name,
                        target: arr[1].display_name
                    }))
            };

            const Graph = ForceGraph3D()
                (document.getElementById('3d-graph'))
                .graphData(gData)
                .nodeThreeObject(node => {
                    const sprite = new SpriteText(node.id);
                    sprite.material.depthWrite = false;
                    sprite.color = 'rgb(77, 172, 147)';
                    sprite.textHeight = 8;
                    return sprite;
                })
                .linkOpacity([0.5])
                .linkWidth([0.5])
                .linkColor(link => 'rgb(73, 50, 123)')
                .nodeRelSize([0])
                .backgroundColor('rgb(255, 255, 255)')
                .onNodeClick((node) => setAlumnId(node.alumn_id))

            Graph.d3Force('charge').strength(-20);

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
    }, [publications])

    const closeModal = () => {
        setAlumnId(null)
    }

    return (
        <div style={{ position: 'relative' }}>
            <div id="3d-graph" style={{ margin: 0, width: '100%' }}></div>
            {alumnId ?
                <div id="alumnShow"
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
        </div>
    )
}

export default Graph