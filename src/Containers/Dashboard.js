import { useState } from 'react'
import AlumnCard from '../Components/AlumnCard'
import Accordion from 'react-bootstrap/Accordion'
function Dashboard({ alumns }) {

  const [idObj, setIdObj] = useState({})

  const updateIdArray = (id, display) => {
    let newIdObj = { ...idObj }
    newIdObj[id] = display
    setIdObj(newIdObj)
  }

  const mapAlumns = () => {
    return alumns.map(alumn => <AlumnCard key={alumn.id} alumn={alumn} updateIdArray={updateIdArray} />)
  }

  const updateDatabase = () => {
    for (const id in idObj) {
      let bodyObj = {
        display: idObj[id]
      }
      const options = {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bodyObj)
      }

      fetch(`http://localhost:3000/api/v1/alumn_publications/${id}`, options)
        .then(res => res.json())
        .then(console.log)
    }
  }

  return (
    <div className="dashboard">
      <Accordion>
        {mapAlumns()}
      </Accordion>
      <button onClick={updateDatabase}>Update Database</button>
    </div>

  )
}

export default Dashboard