import { useState } from 'react';

function Loading() {
    const [showLongLoadingMessage, setShowLongLoadingMessage] = useState(false);
    const [showCoffeeLoadingMessage, setShowCoffeeLoadingMessage] = useState(false);
    const [showNoReallyLoadingMessage, setShowNoReallyLoadingMessage] = useState(false);


    setTimeout(() => {
        setShowLongLoadingMessage(true);
    }, 5000);

    setTimeout(() => {
        setShowCoffeeLoadingMessage(true);
    }, 15000);

    setTimeout(() => {
        setShowNoReallyLoadingMessage(true);
    }, 25000);

    return (
        <div>
            <h2 className="animate">Loading</h2>
            {showLongLoadingMessage ? <h4 className="non-animate">This may take awhile...</h4> : <></>}
            {showCoffeeLoadingMessage ? <h4 className="non-animate">You should grab some coffee 😅</h4> : <></>}
            {showNoReallyLoadingMessage ? <h4 className="non-animate">No really, grab some coffee...</h4> : <></>}
        </div>
    );
}

export default Loading;