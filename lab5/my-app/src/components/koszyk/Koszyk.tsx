import React from "react";
import { Produkt } from "./Produkt";

export const Koszyk: React.FC = () => {
    return (
        <div>
            <h3>Koszyk</h3>
            <Produkt nazwa="Jabłko" />
            <Produkt nazwa="Gruszka" />
            <Produkt nazwa="Śliwka" />
            <Produkt nazwa="Wiśnia" />
            <Produkt nazwa="Banan" />
        </div>
    );
};