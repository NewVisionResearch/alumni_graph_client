import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import ApproveComponent from "../Components/ApproveComponent";
import { approveRequest } from "../services/api";

function ApproveContainer() {
    let { token } = useParams();

    let [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        approveRequest(token, signal)
            .then(res => {
                console.log(res);
                if (!res.ok) { throw res; }
                return res.json();
            })
            .then((request) => {
                setLoading(false);
                console.log("Request: ", request);
            })
            .catch((err) => {
                err.json().then((errorResponse) => console.error(errorResponse));
            });

        return () => {
            controller.abort();
        };

    }, [token]);

    return (
        <ApproveComponent loading={loading} />
    );
}

export default ApproveContainer;