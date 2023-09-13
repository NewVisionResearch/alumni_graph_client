import { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";

import "../styles/Loading.css";

function Loading({ progressMapData = { status: "", percentage: 0 } }) {
    const [loadingMessage, setLoadingMessage] = useState("");

    const progressMessages = {
        queued: "Job added to queue!",
        retrying: "Temporary hiccup. Job retrying soon.",
        working: "Job has started!",
        default: "Loading...",
    };

    useEffect(() => {
        const timeouts = [
            { delay: 5000, message: "This may take awhile..." },
            { delay: 15000, message: "Thank you for being patient 🙏" },
            {
                delay: 25000,
                message: "Still with us? We appreciate your patience! 😄",
            },
        ].map((item) =>
            setTimeout(() => setLoadingMessage(item.message), item.delay)
        );

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, []);

    return (
        <div className="m-2">
            <h2 className="animate">
                {progressMessages[progressMapData.status] ||
                    progressMessages.default}
            </h2>

            {progressMapData.status !== "" && (
                <ProgressBar
                    className="m-2"
                    now={progressMapData.percentage}
                    animated
                />
            )}

            {loadingMessage && (
                <h4 className="non-animate">{loadingMessage}</h4>
            )}
        </div>
    );
}

export default Loading;
