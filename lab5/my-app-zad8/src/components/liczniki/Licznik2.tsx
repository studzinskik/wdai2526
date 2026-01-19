import React, { useState, useEffect } from "react";

export const Licznik2: React.FC = () => {
    const [count, setCount] = useState(() => {
        const saved = localStorage.getItem("licznik2");
        return saved ? parseInt(saved) : 0;
    });

    useEffect(() => {
        localStorage.setItem("licznik2", count.toString());
    }, [count]);

    return (
        <div>
            <div>Licznik (LocalStorage): {count}</div>
            <button onClick={() => setCount(count + 1)}>Dodaj</button>
        </div>
    );
};