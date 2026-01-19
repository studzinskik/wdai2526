import React, { useState, useEffect } from "react";

export const Odliczanie: React.FC = () => {
    const [licznik, setLicznik] = useState(15.0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning && licznik > 0) {
            interval = setInterval(() => {
                setLicznik(prev => {
                    const nextVal = prev - 0.1;
                    return nextVal < 0 ? 0 : nextVal;
                });
            }, 100);
        } else if (licznik <= 0) {
            setIsRunning(false);
        }

        return () => clearInterval(interval);
    }, [isRunning, licznik]);

    const handleButton = () => {
        setIsRunning(!isRunning);
    };

    const isFinished = licznik <= 0.0001;
    
    return (
        <div>
            <div>{licznik.toFixed(1)} sek</div>
            <button 
                onClick={handleButton} 
                disabled={isFinished}
            >
                {isFinished ? "Odliczanie zakończone" : (isRunning ? "STOP" : "START")}
            </button>
        </div>
    );
};