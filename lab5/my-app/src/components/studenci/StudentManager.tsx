import React, { useState } from "react";
import { Dodawanie } from "./Dodawanie";

interface Student {
    imie: string;
    nazwisko: string;
    rocznik: number;
}

export const StudentManager: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([
        { imie: "Jan", nazwisko: "Kowalski", rocznik: 1999 },
        { imie: "Anna", nazwisko: "Nowak", rocznik: 2000 },
        { imie: "Marek", nazwisko: "Zień", rocznik: 1998 },
    ]);

    const addStudent = (imie: string, nazwisko: string, rocznik: number) => {
        setStudents([...students, { imie, nazwisko, rocznik }]);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Rocznik</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, idx) => (
                        <tr key={idx}>
                            <td>{student.imie}</td>
                            <td>{student.nazwisko}</td>
                            <td>{student.rocznik}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Dodawanie onAdd={addStudent} />
        </div>
    );
};