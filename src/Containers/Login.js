import { useState } from "react"

function Login({ login }) {

    const [admin, setAdmin] = useState({ username: "", password: "" })
    return (
        <div>
            <form
                onSubmit={(e) => {
                    setAdmin({ username: "", password: "" })
                    login(e, admin)
                }}>
                <input
                    type="text"
                    name="username"
                    value={admin.username}
                    onChange={({ target: { name, value } }) => setAdmin({ ...admin, [name]: value })}
                />
                <input
                    type="text"
                    name="password"
                    value={admin.password}
                    onChange={({ target: { name, value } }) => setAdmin({ ...admin, [name]: value })}
                />
                <input
                    type="submit"
                    value="Login"
                />
            </form>
        </div>
    )
}

export default Login
