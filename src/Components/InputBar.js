import { useState, useEffect } from 'react'

function InputBar({ submitInput, _value }) {

    const [inputVal, setInputVal] = useState("")

    useEffect(() => {
        if (_value) {
            setInputVal(_value.join(", "))
        }
    }, [_value])

    return (
        <form onSubmit={(e) => {
            setInputVal("")
            submitInput(e, inputVal)
        }}>
            <input type="text" value={inputVal} onChange={({ target: { value } }) => setInputVal(value)} />
            <input type="submit" value="Add Alumn" />
        </form>
    )
}

export default InputBar