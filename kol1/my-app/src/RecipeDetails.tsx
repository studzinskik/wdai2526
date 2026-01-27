import React, { createContext, useState, useEffect, type ReactNode } from "react";

export interface Recipe {
    id: number;
    name: string;
    cuisine: string;
    difficulty: string;
    rating: number;
    reviewCount: number;
    image: string;
    ingredients: string[];
    instructions: string[];
}

interface RecipeContextType {
    recipes: Recipe[];
    loading: boolean;
    removeRecipe: (id: number) => void;
    updateRating: (id: number, newRating: number) => void;
}

export const RecipeContext = createContext<RecipeContextType>({} as RecipeContextType);

interface RecipeProviderProps {
    children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch("https://dummyjson.com/recipes")
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data.recipes);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const removeRecipe = (id: number) => {
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    };

    const updateRating = (id: number, newRating: number) => {
        setRecipes((prev) =>
            prev.map((recipe) => {
                if (recipe.id === id) {
                    const newCount = recipe.reviewCount + 1;
                    const newAvg = ((recipe.rating * recipe.reviewCount) + newRating) / newCount;
                    console.log(newAvg)

                    return {
                        ...recipe,
                        rating: newAvg,
                        reviewCount: newCount
                    };
                }
                return recipe;
            })
        );
    };

    return (
        <RecipeContext.Provider value={{ recipes, loading, removeRecipe, updateRating }}>
            {children}
        </RecipeContext.Provider>
    );
};