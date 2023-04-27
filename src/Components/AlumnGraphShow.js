import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Accordion } from 'react-bootstrap'
import { byDate, byCoAuthors, sortByTwoFns } from '../services/sorts'
import AccordionCitation from '../Containers/AccordionCitation'
import Loading from './Loading'

function AlumnGraphShow({ alumnLabId, closeModal }) {
    const baseUrl = process.env.REACT_APP_BASE_URL

    const [alumn, setAlumn] = useState({ full_name: "", search_names: [], my_lab_alumn_publications: [] })
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${baseUrl}/alumns/${alumnLabId}`)
            .then(res => {
                if (!res.ok) { throw res }
                return res.json()
            })
            .then(alumnObj => setAlumn(alumnObj))
            .catch((res) => {
                console.error(res)
                navigate("/error")})
    }, [navigate, alumnLabId, baseUrl])

    return (
        <>
            <button
                type="button"
                className="close text-danger"
                aria-label="Close"
                style={{ position: 'sticky', top: 7, right: 7, width: '5%', zIndex: 1000, border: 'none', borderRadius: '25px', background: 'rgba(211,211,211 ,0.55 )' }}
                onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
            </button>
            {
                alumn.my_lab_alumn_publications.length ?
                    <>
                        <h3 className="author-show-name mt-4 mb-3" style={{ width: "100%", textAlign: 'center', color: 'rgb(77, 172, 147)' }}>{alumn.full_name}</h3> {/*, color: 'rgb(77, 172, 147)' */}
                        <Accordion>
                            {
                                sortByTwoFns(byDate, byCoAuthors, alumn.my_lab_alumn_publications).map((alumn_pub, idx) => {
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
        </ >
    )
}

export default AlumnGraphShow