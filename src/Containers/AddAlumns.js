import { useState, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import InputBar from '../Components/InputBar'
import Loading from '../Components/Loading'
import { byLastName } from '../services/sorts'

function AddAlumns({ openAlumnShow, removeAlumnId }) {

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

    useEffect(() => {
        if (removeAlumnId) {
            let newArray = alumns.filter(alumn => alumn.id !== removeAlumnId)
            setAlumns(newArray)
        }
    }, [removeAlumnId])

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

        let alumnObj = {
            display_name: alumnDisplayName.toLowerCase()
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
                openAlumnShow(newAlumn.id)
            })
    }

    return (
        <div className="add-alumns mr-5" >
            <InputBar submitInput={addAlumn} />
            <div style={{ display: 'flex', maxHeight: "700px", overflow: 'hidden', overflowY: 'scroll' }}>
                {loading ? <Loading /> : <ListGroup as="ul" style={{ width: "100%" }}>
                    {byLastName(alumns).map(alumn =>
                        <ListGroup.Item
                            as="li"
                            key={alumn.id}
                            onClick={() => openAlumnShow(alumn.id)}
                            className="">
                            {alumn.search_names[1]}
                        </ListGroup.Item>)}
                </ListGroup>}
            </div>
        </div>
    )
}

export default AddAlumns