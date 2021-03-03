import { Link } from 'react-router-dom'
import InputBar from '../Components/InputBar'

function AddAlumns({ alumns, addAlumn }) {

    return (
        <div>
            <InputBar addAlumn={addAlumn} />
            <ul>
                {alumns.map(alumn => <li><Link to={`/alumns/${alumn.id}`}>{alumn.full_name}</Link></li>)}
            </ul>
        </div>
    )
}

export default AddAlumns