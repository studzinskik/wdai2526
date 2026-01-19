import React, { useState } from "react";
import { Przycisk } from "./Przycisk";

export const NowyLicznik: React.FC = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    return (
        <div>
            <div>Nowy Licznik: {count}</div>
            <Przycisk onClick={increment} />
        </div>
    );
};