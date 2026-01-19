import React, { useState } from "react";

export const Logowanie: React.FC = () => {
    const [username, setUsername] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");

    const isDisabled = !username || !pass1 || !pass2;

    const handleLogin = () => {
        if (pass1 !== pass2) {
            alert("Hasła nie są zgodne");
        } else {
            alert("Zalogowano poprawnie");
        }
    };

    return (
        <div>
            <label>Nazwa użytkownika: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></label>
            <br />
            <label>Hasło: <input type="text" value={pass1} onChange={(e) => setPass1(e.target.value)} /></label>
            <br />
            <label>Powtórz Hasło: <input type="text" value={pass2} onChange={(e) => setPass2(e.target.value)} /></label>
            <br />
            <button disabled={isDisabled} onClick={handleLogin}>Logowanie</button>
        </div>
    );
};