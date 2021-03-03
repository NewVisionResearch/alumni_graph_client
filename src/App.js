
import React from 'react'
import NavBar from './Containers/NavBar'
import Graph from './Containers/Graph'
import Dashboard from './Containers/Dashboard'
import AddAlumns from './Containers/AddAlumns'
import AlumnShow from './Containers/AlumnShow'
import { Route, Switch } from 'react-router-dom'
import { useState, useEffect } from 'react'

function App() {

  const [alumns, setAlumns] = useState([])

  useEffect(() => {
    fetchAlumns()
  }, [])

  const fetchAlumns = () => {
    fetch('http://localhost:3000/api/v1/alumns')
      .then(res => res.json())
      .then((alumnsArray) => setAlumns(alumnsArray))
  }

  const addAlumn = (e, alumnDisplayName) => {
    e.preventDefault()

    let alumnObj = {
      display_name: alumnDisplayName
    }

    let options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(alumnObj)
    }

    fetch('http://localhost:3000/api/v1/alumns', options)
      .then(res => res.json())
      .then(newAlumn => {
        console.log(newAlumn)
        let newArray = [...alumns, newAlumn]
        setAlumns(newArray)
      })
  }

  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Graph} />
        <Route path="/dashboard" render={() => <Dashboard alumns={alumns} />} />
        <Route path="/add" render={() => <AddAlumns alumns={alumns} addAlumn={addAlumn} />} />
        <Route path="/alumns/:id" component={AlumnShow} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
