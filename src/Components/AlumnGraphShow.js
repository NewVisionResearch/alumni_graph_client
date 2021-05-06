import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Accordion } from 'react-bootstrap'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import AccordionCitation from '../Containers/AccordionCitation'
import Loading from './Loading'

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

    return (
        <div>
            <button
                type="button"
                className="close text-danger"
                aria-label="Close"
                style={{ position: 'sticky', top: 20, right: 360, zIndex: 1000 }}
                onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
            </button>
            {
                alumn.my_alumn_publications.length ?
                    <>
                        <h3 className="mt-4 mb-3" style={{ width: "100%", textAlign: 'center' }}>{alumn.full_name}</h3>
                        <Accordion defaultActiveKey="0">
                            {
                                sortByTwoFns(byDate, byCoAuthors, alumn.my_alumn_publications).map((alumn_pub, idx) => {
                                    const { publication, coauthors } = alumn_pub

                                    return (
                                        <AccordionCitation key={`${alumn_pub}_${idx}`} listNum={idx} alumnName={alumn.search_names[0]} publication={publication} coauthors={coauthors} />
                                    )
                                })
                            }
                        </Accordion>
                    </>
                    :
                    <div>
                        <Loading />
                    </div>
            }
        </div >
    )
}

export default AlumnGraphShow