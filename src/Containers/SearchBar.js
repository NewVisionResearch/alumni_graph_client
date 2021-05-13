import { useState } from 'react'
import Input from '../Components/Input'
import { SearchResult } from '../Components/SearchResult'
import { decideZoomOnClick } from '../services/zoom'

export default function SearchBar({ graph, nodes, setAlumnId }) {

  const [searchTerm, setSearchTerm] = useState('')

  const focusFxn = (id, x, y) => {
    setAlumnId(id)
    setSearchTerm('')
    graph.centerAt((window.innerWidth <= 425 ? x : x + 75), (window.innerWidth <= 425 ? y + 25 : y), 1000);
    graph.zoom(decideZoomOnClick(), 1000)
  }

  const filterResults = () => {
    if (searchTerm) {
      let gNodes = nodes.filter(alumn => alumn.id.toLowerCase().includes(searchTerm.toLowerCase()))
      return gNodes.map(node => <SearchResult node={node} focusFxn={focusFxn} />)
    }
  }

  return (
    <div
      className='search-bar'
      style={{
        position: 'absolute',
        left: 30,
        top: 30,
        height: 'fit-content',
        width: '25%',
        zIndex: 1000,
        background: 'rgb(255, 255, 255)',
        border: '1px solid black',
        borderRadius: '.25rem',
        boxShadow: '-1px 1px 20px rgb(31, 31, 31)'
      }}>
      <Input callback={setSearchTerm} propsValue={searchTerm} />
      <ul
        style={{
          maxHeight: '80vh',
          margin: 0,
          overflow: 'hidden',
          overflowY: 'scroll'
        }}>
        {filterResults()}
      </ul>
    </div >
  )
}