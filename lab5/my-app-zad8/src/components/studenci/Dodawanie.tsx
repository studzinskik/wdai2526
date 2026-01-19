import React, { useState } from "react";

interface DodawanieProps {
    onAdd: (imie: string, nazwisko: string, rocznik: number) => void;
}

export const Dodawanie: React.FC<DodawanieProps> = ({ onAdd }) => {
    const [imie, setImie] = useState("");
    const [nazwisko, setNazwisko] = useState("");
    const [rocznik, setRocznik] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const rocznikNum = parseInt(rocznik);

        if (!imie || !nazwisko || !rocznik) {
            alert("Wypełnij wszystkie pola");
            return;
        }

        if (isNaN(rocznikNum)) {
            alert("Rocznik musi być liczbą");
            return;
        }

        onAdd(imie, nazwisko, rocznikNum);
        setImie("");
        setNazwisko("");
        setRocznik("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Imię" value={imie} onChange={e => setImie(e.target.value)} />
            <input placeholder="Nazwisko" value={nazwisko} onChange={e => setNazwisko(e.target.value)} />
            <input placeholder="Rocznik" value={rocznik} onChange={e => setRocznik(e.target.value)} />
            <button type="submit">Dodaj</button>
        </form>
    );
};