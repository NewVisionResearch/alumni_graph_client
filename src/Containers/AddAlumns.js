import { useState, useEffect } from 'react'
import InputBar from '../Components/InputBar'

function AddAlumns({ openAlumnShow }) {

    const [alumns, setAlumns] = useState([])

    useEffect(() => {
        fetchAlumns()
    }, [])

    const fetchAlumns = () => {
        fetch('http://localhost:3000/api/v1/alumns')
            .then(res => res.json())
            .then((alumnsArray) => setAlumns(alumnsArray))
    }

    const addAlumn = (e, alumnDisplayName) => {
        e.preventDefault()

        let alumnObj = {
            display_name: alumnDisplayName.toLowerCase()
        }

        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
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
            <ul>
                {alumns.map(alumn => <li onClick={() => openAlumnShow(alumn.id)}>{alumn.full_name}</li>)}
            </ul>
        </div>
    )
}

export default AddAlumns