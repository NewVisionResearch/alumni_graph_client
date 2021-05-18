export function SearchResult({ node: { id, alumn_id, x, y }, focusFxn }) {
  return <li
    className="search-result"
    onClick={() => focusFxn(alumn_id, x, y)}>
    {id}
  </li>
}