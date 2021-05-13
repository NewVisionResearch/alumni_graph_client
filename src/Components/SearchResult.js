export function SearchResult({ node, focusFxn }) {
  const { id, alumn_id, x, y } = node
  return <li
    className="search-result"
    onClick={() => focusFxn(alumn_id, x, y)}>
    {id}
  </li>
}