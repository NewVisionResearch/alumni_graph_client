import { useState, useEffect } from 'react'
function Dashboard() {

  const [alumns, setAlumns] = useState([])

  useEffect(() => {
    fetchAlumns()
  }, [])

  const fetchAlumns = () => {
    fetch('http://localhost:3000/api/v1/alumns')
      .then(res => res.json())
      .then((alumnsArray) => setAlumns(alumnsArray))
  }

  return (
    <div>
      {console.log(alumns)}
    </div>
  )
}

export default Dashboard