import React, { useState } from "react";

export const Haslo: React.FC = () => {
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");

    const getMessage = () => {
        if (!pass1 && !pass2) return "Proszę wprowadzić hasło";
        if (pass1 !== pass2) return "Hasła nie są zgodne";
        return "";
    };

    return (
        <div>
            <label>Hasło: <input type="text" value={pass1} onChange={(e) => setPass1(e.target.value)} /></label>
            <br />
            <label>Powtórz Hasło: <input type="text" value={pass2} onChange={(e) => setPass2(e.target.value)} /></label>
            <div>{getMessage()}</div>
        </div>
    );
};