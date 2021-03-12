import { useState, useEffect } from 'react'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import dashToDate from '../services/conversions'

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
                const { pmid, title, pubdate } = publication

                return (
                    <div div className="publication-list" >
                        <p>{dashToDate(pubdate)}: <a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`} rel='noreferrer' target='_blank'>{title}</a></p>
                        <ul className="coAuthors">
                            {coauthors.map(coauthor => <li key={`${coauthor}_${ap_id}`}>{coauthor}</li>)}
                        </ul>
                    </div>
                )
            })}
        </div >
    )
}

export default AlumnGraphShow