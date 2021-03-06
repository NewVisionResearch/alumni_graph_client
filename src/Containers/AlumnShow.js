import { useState, useEffect } from 'react'
import PublicationDisplayCheck from './PublicationDisplayCheck'

function AlumnShow({ id }) {


    const [alumn, setAlumn] = useState({ full_name: "", search_names: [], my_alumn_publications: [] })
    const [idObj, setIdObj] = useState({})

    useEffect(() => {
        console.log(id)
        const fetchAlumn = () => {
            fetch(`http://localhost:3000/api/v1/alumns/${id}`)
                .then(res => res.json())
                .then(alumnObj => setAlumn(alumnObj))
        }

        fetchAlumn()
    }, [id])

    const updateIdArray = (id, display) => {
        let newIdObj = { ...idObj }
        newIdObj[id] = display
        setIdObj(newIdObj)
    }

    const updateDatabase = () => {
        for (const id in idObj) {
            let bodyObj = {
                display: idObj[id]
            }

            const options = {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            }

            fetch(`http://localhost:3000/api/v1/alumn_publications/${id}`, options)
                .then(res => res.json())
                .then(console.log)
        }
    }

    const sortByNumberOfCoAuthors = (array) => {
        return array.sort((a, b) => b.coauthors.length - a.coauthors.length)
    }

    return (
        <div>
            <h1>{alumn.full_name}</h1>
            Search names:
            <ol>
                {alumn.search_names.map(name => <li key={name}>{name}</li>)}
            </ol>
            <ul>
                {sortByNumberOfCoAuthors(alumn.my_alumn_publications).map(alumn_pub =>
                    <PublicationDisplayCheck
                        key={`${alumn_pub.ap_id}`}
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