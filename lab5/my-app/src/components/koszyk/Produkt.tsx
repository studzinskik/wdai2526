import React from "react";

interface ProduktProps {
    nazwa: string;
}

export const Produkt: React.FC<ProduktProps> = ({ nazwa }) => {
    return <div>{nazwa}</div>;
};