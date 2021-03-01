import { useState } from 'react'

function InputBar({ addAlumn }) {

    const [inputVal, setInputVal] = useState("")

    return (
        <form onSubmit={(e) => {
            setInputVal("")
            addAlumn(e, inputVal)
        }}>
            <input type="text" value={inputVal} onChange={({ target: { value } }) => setInputVal(value)} />
            <input type="submit" value="Add Alumn" />
        </form>
    )
}

export default InputBar