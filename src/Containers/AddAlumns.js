import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import Loading from '../Components/Loading'
import { byLastName } from '../services/sorts'
import FormComponent from './NewAlumnForm'

function AddAlumns({ openAlumnShow, removeAlumnId, confirmRemovedAlumn }) {
    const baseUrl = process.env.REACT_APP_BASE_URL

    const [alumns, setAlumns] = useState([])
    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const memoizedAlumnFetch = useCallback(
        () => {
            const token = localStorage.getItem('jwt')

            const options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            return fetch(`${baseUrl}/alumns`, options)
                .then(res => {
                    if (!res.ok) { throw res }
                    return res.json()
                })
                .then((alumnsArray) => setAlumns(alumnsArray))
                .catch((res) => history.push("/error"))
        },
        [history, baseUrl]
    );
    useEffect(() => {
        if (!alumns.length) {
            memoizedAlumnFetch()
        }
    }, [alumns.length, memoizedAlumnFetch])

    useEffect(() => {
        if (alumns.length) {
            setLoading(false)
        }
    }, [alumns.length])

    useEffect(() => {
        if (removeAlumnId) {
            memoizedAlumnFetch()
                .then(confirmRemovedAlumn)
        }
    }, [alumns, memoizedAlumnFetch, removeAlumnId, confirmRemovedAlumn])

    const addAlumn = (alumnDisplayName) => {
        setLoading(true)
        const token = localStorage.getItem('jwt')

        let alumnObj = {
            display_name: alumnDisplayName.toLowerCase()
        }

        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(alumnObj)
        }

        fetch(`${baseUrl}/alumns`, options)
            .then(res => {
                if (!res.ok) { throw res }
                return res.json()
            })
            .then(newAlumn => {
                let newArray = [...alumns, newAlumn]
                setAlumns(newArray)
                openAlumnShow(newAlumn.id)
            })
            .catch(err => {
                if (err.statusText === "Internal Server Error") {
                    const mute = err
                } else {
                    history.push("/error")
                }
            })
    }

    return (
        <div className="add-alumns mr-5" >
            <FormComponent submitInput={addAlumn} />
            <div style={{ display: 'flex', maxHeight: "700px", overflow: 'hidden', overflowY: 'scroll' }}>
                {loading ? <Loading /> : <ListGroup as="ul" style={{ width: "100%" }}>
                    {byLastName(alumns).map(alumn =>
                        <ListGroup.Item
                            as="li"
                            key={alumn.id}
                            onClick={() => openAlumnShow(alumn.id)}
                            className="">
                            {alumn.search_names[1]}
                        </ListGroup.Item>)}
                </ListGroup>}
            </div>
        </div>
    )
}

export default AddAlumns