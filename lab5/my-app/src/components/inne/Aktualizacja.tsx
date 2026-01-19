import React, { useState } from "react";

export const Aktualizacja: React.FC = () => {
    const [produkt, setProdukt] = useState({ nazwa: "Pomidor", cena: 50 });

    const zmienCene = () => {
        setProdukt(prev => ({ ...prev, cena: 100 }));
    };

    return (
        <div>
            <div>Aktualnie {produkt.nazwa} kosztuje {produkt.cena}</div>
            <button onClick={zmienCene}>Zmień cenę</button>
        </div>
    );
};