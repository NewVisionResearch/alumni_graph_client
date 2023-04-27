import { useEffect, useState } from "react"
import { Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

function Approve() {
    let { token } = useParams();

    let [loading, setLoading] = useState(true);

    const baseUrl = process.env.REACT_APP_BASE_URL

    useEffect(() => {

        let options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
          }

        fetch(`${baseUrl}/requests/${token}/approve`, options)
            .then(res => {
                // setRegisterError("")
                console.log(res)
                if (!res.ok) { throw res }
                return res.json()
            })
            .then((request) => {
                // setLab({email: "", username: "", labName: "" })
                // setShowRegisterToast(true);
                setLoading(false);
                console.log("Request: ", request);
            })
            .catch((res) => res.json())
            .then((err) => {
                console.log(err)
                // setLab((prev) => ({...prev, username: ""}))
                // err.username ? setRegisterError(err.username) : setRegisterError(err);
            }
        )
    },[baseUrl, token]) 
    
    return (
        <div 
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ width: '100%', height: '100%'}}>
            <p style={{fontSize: '1.25em', display: loading ? "block" : "none"}}>
                Approving Request...
            </p>
            <Spinner
                animation="border" 
                role="status"
                style={{display: loading ? "inline-block" : "none"}}
                >
                <span className="sr-only">Loading...</span>
            </Spinner>
            <p style={{fontSize: '1.25em', display: loading ? "none" : "block"}}>
                Request approved!
            </p>
            <p style={{fontSize: '1.25em', display: loading ? "none" : "block"}}>
                An email has been sent to the requester.
            </p>
            <p style={{fontSize: '1.25em', display: loading ? "none" : "block"}}>
                You may now close this window.
            </p>
        </div>
    );
}

export default Approve;