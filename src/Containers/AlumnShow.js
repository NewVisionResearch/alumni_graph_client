import { useState, useEffect } from 'react'
import InputBar from '../Components/InputBar'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import PublicationDisplayCheck from '../Components/PublicationDisplayCheck'

function AlumnShow({ id }) {


    const [alumn, setAlumn] = useState({ full_name: "", search_names: [], my_alumn_publications: [] })
    const [idObj, setIdObj] = useState({})
    const [editSearchNames, setEditSearchNames] = useState(false)

    useEffect(() => {
        const fetchAlumn = () => {
            fetch(`http://localhost:3000/api/v1/alumns/${id}`)
                .then(res => res.json())
                .then(alumnObj => setAlumn(alumnObj))
        }

        fetchAlumn()
        setEditSearchNames()
    }, [id])

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
    }
    console.log(alumn.search_names)
    return (
        <div>
            <h1>{alumn.full_name}</h1>
            Search names:
            {editSearchNames ? <InputBar submitInput={updateSearchNames} _value={alumn.search_names} /> : null}
            <button onClick={() => setEditSearchNames(true)}>Edit Search Names</button>
            <ol>
                {alumn.search_names.map(name => <li key={name}>{name}</li>)}
            </ol>
            <p>Publications ({alumn.my_alumn_publications.length}):</p>
            <ul>
                {sortByTwoFns(byDate, byCoAuthors, alumn.my_alumn_publications).map(alumn_pub =>
                    <PublicationDisplayCheck
                        key={`${alumn_pub.ap_id}`}
                        alumnName={alumn.full_name}
                        alumn_publication={alumn_pub}
                        updateIdArray={updateIdArray}
                    />)}
            </ul>
            <button onClick={updateDatabase}>Update Publications</button>
        </div>
    )

}

export default AlumnShow
//.sort((a, b) => parseInt(b.publication.publication_date.split("-")[0]) - parseInt(a.publication.publication_date.split("-")[0]))