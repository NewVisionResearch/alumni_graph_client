import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DenyContainer from "./DenyContainer";
import { denyRequest } from "../../services/api";

function DenyController() {
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
                err.json().then((errorResponse) =>
                    console.error(errorResponse)
                );
            });

        return () => {
            controller.abort();
        };
    }, [token]);

    return <DenyContainer loading={loading} />;
}

export default DenyController;
