import { useState } from 'react'

function PublicationDisplayCheck({ alumn_publication, updateIdArray }) {

    const { ap_id, display, publication, coauthors } = alumn_publication
    const [displayed, setDisplayed] = useState(display)

    return (
        <div>
            <input
                type="checkbox"
                checked={displayed}
                onChange={() => {
                    setDisplayed(!displayed)
                    updateIdArray(ap_id, !displayed)
                }
                } />
            <h4>{publication}</h4>
            <ul className="coAuthors">
                {coauthors.map(coauthor => <li key={ap_id}>{coauthor}</li>)}
            </ul>
        </div>
    )

}

export default PublicationDisplayCheck