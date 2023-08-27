import { useState } from 'react';
import Input from './Input';
import { SearchResult } from './SearchResult';
import { decideZoomOnClick } from '../services/zoom';

export default function SearchBar({ graph, nodes, setAlumnId }) {

  const [searchTerm, setSearchTerm] = useState('');

  const focusFxn = (id, x, y) => {
    setAlumnId(id);
    setSearchTerm('');
    graph.centerAt((window.innerWidth <= 425 ? x : x + 75), (window.innerWidth <= 425 ? y + 25 : y), 1000);
    graph.zoom(decideZoomOnClick(), 1000);
  };

  const filterResults = () => {
    if (searchTerm) {
      let gNodes = nodes.filter(alumn => alumn.id.toLowerCase().includes(searchTerm.toLowerCase()));
      return gNodes.map((node, i) => <SearchResult key={`${node.id}_${i}`} node={node} focusFxn={focusFxn} />);
    }
  };

  (function changeWidthOnFocus() {
    const input = document.getElementById('alumn-search');
    if (input) {
      let windowWidth = window.innerWidth;
      let outer = input.parentNode.parentNode;
      if (outer.classList.contains('search-bar')) {
        input.onfocus = function () {
          if (windowWidth > 825) {
            this.parentNode.parentNode.style.width = '25%';
          } else {
            this.parentNode.parentNode.style.width = '85%';
          }
        };
        input.onblur = function () {
          if (windowWidth > 825) {
            this.parentNode.parentNode.style.width = '10%';
          } else {
            this.parentNode.parentNode.style.width = '25%';
          }
        };
      }
    }
  })();


  return (
    <div
      className='search-bar'
      style={{
        position: 'absolute',
        left: 30,
        top: 30,
        height: 'fit-content',
        zIndex: 1000,
        background: 'rgb(255, 255, 255)',
        border: '1px solid black',
        borderRadius: '.25rem',
        boxShadow: '-1px 1px 10px rgb(31, 31, 31)'
      }}>
      <Input id='alumn-search' callback={setSearchTerm} propsValue={searchTerm} placeholder="Search" />
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
  );
}