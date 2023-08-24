import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DenyComponent from "../Components/DenyComponent";
import { denyRequest } from "../services/api";

function DenyContainer() {
    const { token } = useParams();

    let [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        denyRequest(token, signal)
            .then((res) => {
                console.log(res);
                if (!res.ok) {
                    throw res;
                }
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

    return <DenyComponent loading={loading} />;
}

export default DenyContainer;
