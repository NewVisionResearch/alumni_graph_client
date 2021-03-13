import { useState, useEffect } from 'react'
import InputBar from '../Components/InputBar'
import Loading from '../Components/Loading'
import { byName } from '../services/sorts'

function AddAlumns({ openAlumnShow }) {

    const [alumns, setAlumns] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!alumns.length) {
            fetchAlumns()
        }
    }, [alumns.length])

    useEffect(() => {
        if (alumns.length) {
            setLoading(false)
        }
    }, [alumns.length])

    const fetchAlumns = () => {
        const token = localStorage.getItem('jwt')

        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        fetch('http://localhost:3000/api/v1/alumns', options)
            .then(res => res.json())
            .then((alumnsArray) => setAlumns(alumnsArray))
    }

    const addAlumn = (e, alumnDisplayName) => {
        e.preventDefault()
        setLoading(true)
        const token = localStorage.getItem('jwt')
        // let splitNames = alumnDisplayName.split(" ")
        // let n = splitNames.length
        // let first = splitNames[0]
        // let last
        // let res = []
        // if (n === 2) {
        //     last = splitNames[1]
        //     res.push(alumnDisplayName)
        //     res.push(`${last} ${first[0]}`)
        // } else {
        //     last = splitNames[n - 1]
        //     let name = `${last} `
        //     for (let i = 0; i < n - 2; i++) {
        //         name += splitNames[i][0]
        //     }
        //     res.push(alumnDisplayName)
        //     res.push(name)
        // }
        let alumnObj = {
            display_name: alumnDisplayName.toLowerCase()
            // search_names: res
        }

        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(alumnObj)
        }

        fetch('http://localhost:3000/api/v1/alumns', options)
            .then(res => res.json())
            .then(newAlumn => {
                let newArray = [...alumns, newAlumn]
                setAlumns(newArray)
            })
    }

    return (
        <div>
            <InputBar submitInput={addAlumn} />
            <div style={{ display: 'flex' }}>
                <ul>
                    {byName(alumns).map(alumn => <li key={alumn.id} onClick={() => openAlumnShow(alumn.id)}>{alumn.full_name}</li>)}
                </ul>
                {loading ? <Loading /> : null}
            </div>
        </div>
    )
}

export default AddAlumns