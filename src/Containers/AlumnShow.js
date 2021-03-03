import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PublicationDisplayCheck from './PublicationDisplayCheck'

function AlumnShow() {
    const id = useLocation().pathname.split("/")[2]

    const [alumn, setAlumn] = useState({ display_name: "", search_names: [], my_alumn_publications: [] })

    useEffect(() => {

        const fetchAlumn = () => {
            fetch(`http://localhost:3000/api/v1/alumns/${id}`)
                .then(res => res.json())
                .then(alumnObj => setAlumn(alumnObj))
        }

        fetchAlumn()
    }, [id])

    const sortByNumberOfCoAuthors = (array) => {
        return array.sort((a, b) => b.coauthors.length - a.coauthors.length)
    }


    if (!alumn) {
        return <div>LOADING</div>
    }
    return (
        <div>
            <h1>{alumn.display_name}</h1>
            <ol>
                {alumn.search_names.map(name => <li key={name}>{name}</li>)}
            </ol>
            <ul>
                {sortByNumberOfCoAuthors(alumn.my_alumn_publications).map(alumn_pub => <PublicationDisplayCheck key={`${alumn_pub.ap_id}`} alumn_publication={alumn_pub} />)}
            </ul>
        </div>
    )

}

export default AlumnShow