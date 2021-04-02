import { useState } from 'react'
import AlumnShow from './AlumnShow'
import AddAlumns from './AddAlumns'

function Dashboard() {
  const baseUrl = process.env.REACT_APP_BASE_URL

  const [alumnShowId, setAlumnShowId] = useState(null)
  const [removeAlumnId, setRemoveAlumnId] = useState(null)

  const openAlumnShow = (id) => {
    setAlumnShowId(id)
  }

  const removeAlumn = (e, id) => {
    const token = localStorage.getItem("jwt")

    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    fetch(`${baseUrl}/alumns/${id}`, options)
      .then(res => res.json())
      .then(data => setRemoveAlumnId(id))
      .then(() => setAlumnShowId(null))
  }

  const confirmRemovedAlumn = () => {
    setRemoveAlumnId(null)
  }

  return (
    <div className="dashboard d-flex flex-wrap align-items-center justify-content-center p-5">
      <AddAlumns openAlumnShow={openAlumnShow} removeAlumnId={removeAlumnId} confirmRemovedAlumn={confirmRemovedAlumn} />
      {alumnShowId ? <AlumnShow id={alumnShowId} removeAlumn={removeAlumn} /> : <div></div>}
    </div>
  )
}

export default Dashboard
