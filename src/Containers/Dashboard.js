import { useState } from 'react'
import AlumnShow from './AlumnShow'
import AddAlumns from './AddAlumns'

function Dashboard() {

  const [alumnShowId, setAlumnShowId] = useState(null)

  const openAlumnShow = (id) => {
    setAlumnShowId(id)
  }

  return (
    <div className="dashboard d-flex p-5">
      <AddAlumns openAlumnShow={openAlumnShow} />
      {alumnShowId ? <AlumnShow id={alumnShowId} /> : null}
    </div>
  )
}

export default Dashboard
