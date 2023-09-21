import { Spinner } from "react-bootstrap";

function ApproveContainer({ loading }) {
    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ width: "100%", height: "100%" }}
        >
            <p
                style={{
                    fontSize: "1.25em",
                    display: loading ? "block" : "none",
                }}
            >
                Approving Request...
            </p>
            <Spinner
                animation="border"
                role="status"
                style={{ display: loading ? "inline-block" : "none" }}
            >
                <span className="sr-only">Loading...</span>
            </Spinner>
            <p
                style={{
                    fontSize: "1.25em",
                    display: loading ? "none" : "block",
                }}
            >
                Request approved!
            </p>
            <p
                style={{
                    fontSize: "1.25em",
                    display: loading ? "none" : "block",
                }}
            >
                An email has been sent to the requester.
            </p>
            <p
                style={{
                    fontSize: "1.25em",
                    display: loading ? "none" : "block",
                }}
            >
                You may now close this window.
            </p>
        </div>
    );
}

export default ApproveContainer;
