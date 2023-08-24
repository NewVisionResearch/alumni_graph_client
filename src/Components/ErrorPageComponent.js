function ErrorPageComponent() {
    return (
        <div
            className="d-flex-column justify-content-center align-items-center"
            style={{ width: '100%', height: '100%' }}
        >
            <h1>Sorry</h1>
            <h3>It appears you have encountered an error</h3>
            <p>Please return to the previous page and try again. If the problem persists, don't hesitate to let us know!</p>
        </div>
    );
}

export default ErrorPageComponent;