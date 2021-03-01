import InputBar from '../Components/InputBar'

function AddAlumns({ alumns, addAlumn }) {

    return (
        <div>
            <InputBar addAlumn={addAlumn} />
            <ul>
                {alumns.map(alumn => <li>{alumn.display_name}</li>)}
            </ul>
        </div>
    )
}

export default AddAlumns