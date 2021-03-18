import { useState, useEffect } from 'react'
import InputBar from '../Components/InputBar'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import PublicationDisplayCheck from '../Components/PublicationDisplayCheck'

function AlumnShow({ id }) {


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

    const updateSearchNames = (e, namesArray) => {
        e.preventDefault()
        let bodyObj = {
            search_names: namesArray
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
                <InputBar submitInput={updateSearchNames} _value={alumn.search_names} /> :
                <button onClick={() => setEditSearchNames(true)}>Edit Search Names</button>}
            <p>Publications ({filterValidPublications(alumn.my_alumn_publications).length}):</p>
            <ul style={{ maxHeight: "500px", overflowY: "hidden", overflow: "scroll" }}>
                {sortByTwoFns(byDate, byCoAuthors, filterValidPublications(alumn.my_alumn_publications)).map(alumn_pub =>
                    <PublicationDisplayCheck
                        key={`${alumn_pub.ap_id}`}
                        alumnName={alumn.full_name}
                        alumn_publication={alumn_pub}
                        updateIdArray={updateIdArray}
                        invalidatePublication={invalidatePublication}
                    />)}
            </ul>
            <button onClick={updateDatabase}>Update Publications</button>
            <button onClick={refetchPublications}>Fetch New Publications</button>
        </div>
    )

}

export default AlumnShow