import { useState, useEffect } from 'react';

function Loading() {
    const [showLongLoadingMessage, setShowLongLoadingMessage] = useState(false);
    const [showCoffeeLoadingMessage, setShowCoffeeLoadingMessage] = useState(false);
    const [showNoReallyLoadingMessage, setShowNoReallyLoadingMessage] = useState(false);


    useEffect(() => {
        const longTimeout = setTimeout(() => {
            setShowLongLoadingMessage(true);
        }, 5000);

        const coffeeTimeout = setTimeout(() => {
            setShowCoffeeLoadingMessage(true);
        }, 15000);

        const noCoffeeTimeout = setTimeout(() => {
            setShowNoReallyLoadingMessage(true);
        }, 25000);

        // Cleanup function to cancel timeouts when the component is unmounted
        return () => {
            clearTimeout(longTimeout);
            clearTimeout(coffeeTimeout);
            clearTimeout(noCoffeeTimeout);
        };
    }, []);

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