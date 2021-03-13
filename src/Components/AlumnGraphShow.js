import { useState, useEffect } from 'react'
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
            <span onClick={closeModal}>X</span>
            <h3>{alumn.full_name}</h3>
            {sortByTwoFns(byDate, byCoAuthors, alumn.my_alumn_publications).map(alumn_pub => {
                const { ap_id, publication, coauthors } = alumn_pub

                return (
                    <FullCitation key={`${ap_id}_${alumn.full_name}`} alumnName={alumn.full_name} publication={publication} coauthors={coauthors} />
                )
            })}
        </div >
    )
}

export default AlumnGraphShow