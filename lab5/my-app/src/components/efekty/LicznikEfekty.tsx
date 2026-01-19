import React, { useState, useEffect } from "react";

export const LicznikEfekty: React.FC = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Hello world");
    }, []);

    useEffect(() => {
        console.log(`Licznik zwiększył się do ${count}`);
    }, [count]);

    return (
        <div>
            <div>Stan licznika: {count}</div>
            <button onClick={() => setCount(count + 1)}>Dodaj</button>
        </div>
    );
};