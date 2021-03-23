import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import PublicationDisplayCheck from '../Components/PublicationDisplayCheck'
import EditAlumnForm from './EditAlumnForm'

function AlumnShow({ id, removeAlumn }) {


    const [alumn, setAlumn] = useState({ full_name: "", search_names: [], my_alumn_publications: [] })
    const [idObj, setIdObj] = useState({})
    const [editSearchNames, setEditSearchNames] = useState(false)

    useEffect(() => {
        if (id) {
            const fetchAlumn = () => {
                fetch(`http://localhost:3000/api/v1/alumns/${id}`)
                    .then(res => res.json())
                    .then(alumnObj => setAlumn(alumnObj))
            }

            fetchAlumn()
            setEditSearchNames()
        }
    }, [id])

    const invalidatePublication = (e, pubId) => {
        const options = {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ display: false })
        }

        fetch(`http://localhost:3000/api/v1/publications/${pubId}`, options)
            .then(res => res.json())
            .then(publicationId => {
                let newArray = alumn.my_alumn_publications.filter(ap => ap.publication.id !== publicationId)
                setAlumn({ ...alumn, my_alumn_publications: newArray })
            })
    }

    const updateIdArray = (id, display) => {
        let newIdObj = { ...idObj }
        newIdObj[id] = display
        setIdObj(newIdObj)
    }

    const token = localStorage.getItem("jwt")
    const updateDatabase = () => {

        for (const id in idObj) {
            let bodyObj = {
                display: idObj[id]
            }

            const options = {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyObj)
            }

            fetch(`http://localhost:3000/api/v1/alumn_publications/${id}`, options)

        }
    }

    const refetchPublications = () => {
        const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        fetch(`http://localhost:3000/api/v1/alumns/${id}/refetch`, options)
            .then(res => res.json())
            .then(alumnObj => setAlumn(alumnObj))
    }

    const updateSearchNames = (alumnInfo) => {
        let bodyObj = {
            alumn: alumnInfo
        }

        const options = {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(bodyObj)
        }

        fetch(`http://localhost:3000/api/v1/alumns/${id}`, options)
            .then(res => res.json())
            .then(alumnObj => setAlumn(alumnObj))
            .then(() => setEditSearchNames(false))
    }

    const filterValidPublications = () => {
        return alumn.my_alumn_publications.filter(ap => ap.publication.display === true)
    }

    return (
        <div>
            <h1>{alumn.full_name}</h1>
            Search names:
            <ol>
                {alumn.search_names.map(name => <li key={name}>{name}</li>)}
            </ol>
            {editSearchNames ?
                <EditAlumnForm submitInput={updateSearchNames} propsValue={[alumn.full_name, alumn.search_names]} /> :
                <Button onClick={() => setEditSearchNames(true)}>Edit Alumn</Button>}
            <Button variant="danger" onClick={(e) => removeAlumn(e, id)}>Delete Alumn</Button>
            <p>Publications ({filterValidPublications(alumn.my_alumn_publications).length}):</p>
            <ul style={{ maxHeight: "500px", overflowY: "hidden", overflow: "scroll" }}>
                {sortByTwoFns(byDate, byCoAuthors, filterValidPublications(alumn.my_alumn_publications)).map(alumn_pub =>
                    <PublicationDisplayCheck
                        key={`${alumn_pub.ap_id}`}
                        alumnName={alumn.search_names[0]}
                        alumn_publication={alumn_pub}
                        updateIdArray={updateIdArray}
                        invalidatePublication={invalidatePublication}
                    />)}
            </ul>
            <Button className="mr-3" onClick={updateDatabase}>Update Publications</Button>
            <Button className="ml-3" onClick={refetchPublications}>Fetch New Publications</Button>
        </div>
    )

}

export default AlumnShow