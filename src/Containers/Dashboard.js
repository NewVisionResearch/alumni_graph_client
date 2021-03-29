import { useState } from 'react'
import AlumnShow from './AlumnShow'
import AddAlumns from './AddAlumns'

function Dashboard() {

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

    fetch(`http://localhost:3000/api/v1/alumns/${id}`, options)
      .then(res => res.json())
      .then(data => setRemoveAlumnId(id))
      .then(() => setAlumnShowId(null))
  }

  const confirmRemovedAlumn = () => {
    setRemoveAlumnId(null)
  }

  return (
    <div className="dashboard d-flex p-5">
      <AddAlumns openAlumnShow={openAlumnShow} removeAlumnId={removeAlumnId} confirmRemovedAlumn={confirmRemovedAlumn} />
      {alumnShowId ? <AlumnShow id={alumnShowId} removeAlumn={removeAlumn} /> : null}
    </div>
  )
}

export default Dashboard
