import React from "react";

interface PrzyciskProps {
    onClick: () => void;
}

export const Przycisk: React.FC<PrzyciskProps> = ({ onClick }) => {
    return <button onClick={onClick}>Dodaj</button>;
};