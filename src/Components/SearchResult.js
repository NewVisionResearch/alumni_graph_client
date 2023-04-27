export function SearchResult({ node: { id, alumn_lab_id, x, y }, focusFxn }) {
  return <li
    className="search-result"
    onClick={() => focusFxn(alumn_lab_id, x, y)}>
    {id}
  </li>
}