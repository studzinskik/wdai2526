import React, { useState, useEffect } from "react";

export const Tytul: React.FC = () => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div>
            <label>Zmień tytuł strony: </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
    );
};