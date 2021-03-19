import { useState, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import FullCitation from './FullCitation'

function AlumnGraphShow({ alumnId, closeModal }) {

    const [alumn, setAlumn] = useState({ full_name: "", my_alumn_publications: [] })

    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/alumns/${alumnId}`)
            .then(res => res.json())
            .then(alumnObj => setAlumn(alumnObj))
    }, [alumnId])

    return (
        <div>
            <button
                type="button"
                class="close"
                aria-label="Close"
                style={{ position: 'absolute', top: 10, left: 10 }}
                onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
            </button>
            <h3 className="mt-4 mb-3" style={{ width: "100%", textAlign: 'center' }}>{alumn.full_name}</h3>
            <ListGroup as="ul">
                {sortByTwoFns(byDate, byCoAuthors, alumn.my_alumn_publications).map(alumn_pub => {
                    const { ap_id, publication, coauthors } = alumn_pub

                    return (
                        <ListGroup.Item as="li">
                            <FullCitation key={`${ap_id}_${alumn.full_name}`} alumnName={alumn.full_name} publication={publication} coauthors={coauthors} />
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </div >
    )
}

export default AlumnGraphShow