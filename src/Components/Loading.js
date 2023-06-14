import { useState } from 'react';

function Loading() {
    const [showLongLoadingMessage, setShowLongLoadingMessage] = useState(false);
    setTimeout(() => {
        setShowLongLoadingMessage(true);
    }, 5000);

    return (
        <div>
            <h2 className="animate">Loading</h2>
            {showLongLoadingMessage ? <h4 className="animate">This may take awhile...</h4> : <></>}
        </div>
    );
}

export default Loading;