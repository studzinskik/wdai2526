import React from "react";
import { Produkt } from "./Produkt";

const ProduktyList = ["Jabłko", "Gruszka", "Śliwka", "Wiśnia", "Banan"];

export const NowyKoszyk: React.FC = () => {
    return (
        <div>
            <h3>Nowy Koszyk</h3>
            {ProduktyList.map((item, index) => (
                <Produkt key={index} nazwa={item} />
            ))}
        </div>
    );
};