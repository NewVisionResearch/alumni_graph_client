import { useState } from 'react'
import dashToDate from '../services/conversions'

function PublicationDisplayCheck({ alumn_publication, updateIdArray }) {

    const { ap_id, display, publication, coauthors } = alumn_publication
    const { pmid, title, pubdate } = publication
    const [displayed, setDisplayed] = useState(display)

    return (
        <div className="d-flex align-items-center">
            <input
                type="checkbox"
                checked={displayed}
                onChange={() => {
                    setDisplayed(!displayed)
                    updateIdArray(ap_id, !displayed)
                }} />
            <div className="publication-list">
                <p>{dashToDate(pubdate)}: <a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`} rel='noreferrer' target='_blank'>{title}</a></p>
                <ul className="coAuthors">
                    {coauthors.map(coauthor => <li key={`${coauthor}_${ap_id}`}>{coauthor}</li>)}
                </ul>
            </div>
        </div>
    )

}

export default PublicationDisplayCheck