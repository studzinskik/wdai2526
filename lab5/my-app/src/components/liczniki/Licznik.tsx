import React, { useState } from "react";

export const Licznik: React.FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
            <div>Stan licznika: {count}</div>
            <button onClick={() => setCount(count + 1)}>Dodaj</button>
        </div>
    );
};