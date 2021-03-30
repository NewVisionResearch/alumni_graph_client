import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import FullCitation from './FullCitation'

function AlumnGraphShow({ alumnId, closeModal }) {
    const baseUrl = process.env.REACT_APP_BASE_URL

    const [alumn, setAlumn] = useState({ full_name: "", search_names: [], my_alumn_publications: [] })
    const history = useHistory()

    useEffect(() => {
        fetch(`${baseUrl}/alumns/${alumnId}`)
            .then(res => {
                if (!res.ok) { throw res }
                return res.json()
            })
            .then(alumnObj => setAlumn(alumnObj))
            .catch((res) => history.push("/error"))
    }, [history, alumnId, baseUrl])

    const filterValidPublications = () => {
        return alumn.my_alumn_publications.filter(ap => ap.publication.display === true)
    }

    return (
        <div>
            <button
                type="button"
                className="close"
                aria-label="Close"
                style={{ position: 'absolute', top: 10, left: 10 }}
                onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
            </button>
            <h3 className="mt-4 mb-3" style={{ width: "100%", textAlign: 'center' }}>{alumn.full_name}</h3>
            <ListGroup as="ul">
                {sortByTwoFns(byDate, byCoAuthors, filterValidPublications()).map((alumn_pub, idx) => {
                    const { ap_id, publication, coauthors } = alumn_pub

                    return (
                        <ListGroup.Item className="d-flex" as="li" key={ap_id}>
                            <div>{idx + 1}.</div>
                            <FullCitation key={`${ap_id}_${alumn.full_name}`} alumnName={alumn.search_names[0]} publication={publication} coauthors={coauthors} />
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </div >
    )
}

export default AlumnGraphShow