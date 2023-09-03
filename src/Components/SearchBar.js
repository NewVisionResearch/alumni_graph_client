import { useState } from "react";
import { InputGroup, Form, ListGroup } from "react-bootstrap";

import { decideZoomOnClick } from "../services/zoom";

import "../styles/SearchBar.css";

export default function SearchBar({ graph, nodes, setAlumnId }) {
  const [searchTerm, setSearchTerm] = useState("");

  const focusFxn = (id, x, y) => {
    setAlumnId(id);
    setSearchTerm("");
    graph.centerAt(
      window.innerWidth <= 425 ? x : x + 75,
      window.innerWidth <= 425 ? y + 25 : y,
      1000
    );
    graph.zoom(decideZoomOnClick(), 1000);
  };

  const filterResults = () => {
    if (searchTerm) {
      let gNodes = nodes.filter((alumn) =>
        alumn.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return gNodes;
    }

    return [];
  };

  (function changeWidthOnFocus() {
    const input = document.getElementById("alumn-search");
    if (input) {
      let windowWidth = window.innerWidth;
      let outer = input.parentNode.parentNode;
      if (outer.classList.contains("search-bar")) {
        input.onfocus = function () {
          if (windowWidth > 825) {
            this.parentNode.parentNode.style.width = "25%";
          } else {
            this.parentNode.parentNode.style.width = "85%";
          }
        };
        input.onblur = function () {
          if (windowWidth > 825) {
            this.parentNode.parentNode.style.width = "10%";
          } else {
            this.parentNode.parentNode.style.width = "25%";
          }
        };
      }
    }
  })();

  return (
    <div className="search-bar">
      <InputGroup>
        <Form.Control
          id="alumn-search"
          type="text"
          value={searchTerm}
          placeholder="Search..."
          onChange={({ target: { value } }) => setSearchTerm(value)}
        />
      </InputGroup>
      <ListGroup as="ul" className="search-bar-list">
        {filterResults().map((node, i) => (
          <ListGroup.Item
            key={`${node.id}_${i}`}
            className="search-bar-result"
            action
            onClick={() => focusFxn(node.alumn_id, node.x, node.y)}
          >
            {node.id}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
