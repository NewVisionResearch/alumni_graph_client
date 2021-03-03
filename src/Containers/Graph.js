import { useState, useEffect } from 'react'
import ForceGraph3D from '3d-force-graph'

function Graph() {

    const [publications, setPublications] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/api/v1/graphs')
            .then(res => res.json())
            .then(publications => setPublications(publications))
    }, [])
    useEffect(() => {
        if (publications.length) {
            const gData = {
                nodes: uniqueIds(publications).map(i => ({ id: i })),
                links: createPairs(publications)
                    .map(arr => ({
                        source: arr[0],
                        target: arr[1]
                    }))
            };

            const Graph = ForceGraph3D()
                (document.getElementById('3d-graph'))
                .onNodeClick(clickNode)
                .graphData(gData)

        }
    }, [publications])

    function clickNode(node) {
        let id = node.id
        fetch(`http://localhost:3000/api/v1/alumns/${id}`)
            .then(res => res.json())
            .then(alumnObj => {
                let modal = document.getElementById('alumnShow')
                modal.innerHTML = `
                    <h1>${alumnObj.full_name}</h1>
                `
                modal.zIndex = '1000'
                modal.background = 'white'
                modal.color = 'white'
            })

    }

    function uniqueIds(array) {
        array = array.map(p => (p.joins.map(j => j))).flat()
        let obj = {}

        for (let i = 0; i < array.length; i++) {
            if (obj[array[i]]) {
                continue
            } else {
                obj[array[i]] = true
            }
        }
        let res = Object.keys(obj)

        for (let i = 0; i < res.length; i++) {
            res[i] = parseInt(res[i])
        }

        return res
    }

    function createPairs(array) {
        let resArray = []
        let obj = {}
        array = array.map(obj => obj.joins)
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                obj[array[i][j]] = obj[array[i][j]] || []
                for (let k = 0; k < array[i].length; k++) {
                    if (array[i][j] === array[i][k]) {
                        continue
                    }
                    if (obj[array[i][j]].includes(array[i][k])) {
                        continue
                    } else {
                        obj[array[i][j]].push(array[i][k])
                        resArray.push([array[i][j], array[i][k]])
                    }
                }
            }
        }
        return resArray
    }



    return (
        <div style={{ position: 'relative' }}>
            <div id="3d-graph" style={{ margin: 0, width: '100%' }}></div>
            <div id="alumnShow" style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px' }}>

            </div>
        </div>
    )
}

export default Graph