import { useState, useEffect } from 'react'

function AlumnGraphShow({ alumnId, closeModal }) {

    const [alumn, setAlumn] = useState({ full_name: "", my_alumn_publications: [] })

    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/alumns/${alumnId}`)
            .then(res => res.json())
            .then(alumnObj => setAlumn(alumnObj))
    }, [])
    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/alumns/${alumnId}`)
            .then(res => res.json())
            .then(alumnObj => setAlumn(alumnObj))
    }, [alumnId])

    const sortByNumberOfCoAuthors = (array) => {
        return array.sort((a, b) => b.coauthors.length - a.coauthors.length)
    }

    return (
        <div>
            <span onClick={closeModal}>X</span>
            <h3>{alumn.full_name}</h3>
            {sortByNumberOfCoAuthors(alumn.my_alumn_publications).map(alumn_pub => {

                return (<div div className="publication-list" >
                    <p><a href={`https://pubmed.ncbi.nlm.nih.gov/${alumn_pub.publication.pmid}`} rel='noreferrer' target='_blank'>{alumn_pub.publication.title}</a></p>
                    <ul className="coAuthors">
                        {alumn_pub.coauthors.map(coauthor => <li key={`${coauthor}_${alumn_pub.ap_id}`}>{coauthor}</li>)}
                    </ul>
                </div>)
            })}
        </div >
    )
}

export default AlumnGraphShow