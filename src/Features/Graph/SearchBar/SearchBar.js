import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

import { decideZoomOnClick } from "../../../services/zoom";

import "./styles/SearchBar.css";

export default function SearchBar({ graph, nodes, setAlumnId }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [inputWidth, setInputWidth] = useState("");

    const focusFxn = (id, x, y) => {
        setAlumnId(id);
        setSearchTerm("");

        graph.centerAt(
            x + (window.innerWidth < 425 ? 0 : 50),
            y + (window.innerHeight < 425 ? 25 : 0),
            1000
        );
        graph.zoom(decideZoomOnClick(), 1000);
    };

    const filterResults = () => {
        if (!searchTerm) return [];

        return nodes.filter((alumn) =>
            alumn.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const results = filterResults();

    const handleInputFocus = () => {
        if (window.innerWidth > 825) {
            setInputWidth("25%");
        } else {
            setInputWidth("85%");
        }
    };

    const handleInputBlur = () => {
        if (window.innerWidth > 825) {
            setInputWidth("10%");
        } else {
            setInputWidth("25%");
        }
    };

    return (
        <div className="search-bar" style={{ width: inputWidth }}>
            <InputGroup>
                <Form.Control
                    type="text"
                    value={searchTerm}
                    placeholder="Search..."
                    onChange={({ target: { value } }) => setSearchTerm(value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
            </InputGroup>
            <ListGroup as="ul" className="search-bar-list">
                {results.length > 0
                    ? results.map((node, i) => (
                          <ListGroup.Item
                              key={`${node.id}_${i}`}
                              className="search-bar-result"
                              action
                              onClick={() =>
                                  focusFxn(node.alumn_id, node.x, node.y)
                              }
                          >
                              {node.id}
                          </ListGroup.Item>
                      ))
                    : searchTerm && (
                          <ListGroup.Item as="li" key={0} className="">
                              No Result Found
                          </ListGroup.Item>
                      )}
            </ListGroup>
        </div>
    );
}
