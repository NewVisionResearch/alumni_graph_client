import { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";

import "../styles/Loading.css";

function Loading({ progressPercentage = 0, progressStatus = "" }) {
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
            { delay: 15000, message: "You should grab some coffee 😅" },
            { delay: 25000, message: "No really, grab some coffee..." },
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
                {progressMessages[progressStatus] || progressMessages.default}
            </h2>

            {progressStatus !== "" && (
                <ProgressBar
                    className="m-2"
                    now={progressPercentage}
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
