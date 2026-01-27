import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import "./App.css";
import { RecipeProvider, RecipeContext, type Recipe as RecipeType } from "./RecipeDetails";

interface SearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <input
            type="text"
            className="search-input"
            placeholder="Filtruj przepisy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
};

interface RandomProps {
    onRandomSelect: () => void;
}

const Random: React.FC<RandomProps> = ({ onRandomSelect }) => {
    return (
        <button className="random-btn" onClick={onRandomSelect}>
            Szczęśliwy traf
        </button>
    );
};

interface RecipeCardProps {
    data: RecipeType;
    shouldAnimate: boolean;
}

const Recipe: React.FC<RecipeCardProps> = ({ data, shouldAnimate }) => {
    const navigate = useNavigate();
    const { removeRecipe } = useContext(RecipeContext);

    const goToDetails = () => {
        navigate(`/recipe/${data.id}`);
    };

    return (
        <div className={`recipe-card ${shouldAnimate ? "animate" : ""}`}>
            <div className="recipe-info" onClick={goToDetails}>
                <h3>{data.name}</h3>
                <p><strong>Kuchnia:</strong> {data.cuisine}</p>
                <p><strong>Trudność:</strong> {data.difficulty}</p>
                <p><strong>Ocena:</strong> {parseFloat(data.rating.toFixed(1))} ⭐</p>
            </div>
            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    removeRecipe(data.id);
                }}
            >
                Usuń
            </button>
        </div>
    );
};

const RecipeList: React.FC = () => {
    const { recipes, loading } = useContext(RecipeContext);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [animate, setAnimate] = useState<boolean>(false);
    const [randomRecipe, setRandomRecipe] = useState<RecipeType | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            const timerStart = setTimeout(() => {
                setAnimate(true);
                setTimeout(() => {
                    setAnimate(false);
                }, 1000);
            }, 3000);

            return () => clearTimeout(timerStart);
        }
    }, [loading]);

    const handleRandom = () => {
        if (recipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * recipes.length);
            const randomId = recipes[randomIndex].id;
            navigate(`/recipe/${randomId}`);
        }
    };

    useEffect(() => {
        if (searchTerm) setRandomRecipe(null);
    }, [searchTerm]);

    if (loading) return <div>Ładowanie danych...</div>;

    let displayedRecipes = recipes;

    if (randomRecipe) {
        displayedRecipes = [randomRecipe];
    } else {
        displayedRecipes = recipes.filter(r =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return (
        <div>
            <div className="controls">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <Random onRandomSelect={handleRandom} />
            </div>

            <div className="recipe-list">
                {displayedRecipes.map((recipe) => (
                    <Recipe
                        key={recipe.id}
                        data={recipe}
                        shouldAnimate={animate}
                    />
                ))}
                {displayedRecipes.length === 0 && <p>Brak przepisów.</p>}
            </div>
        </div>
    );
};

const RecipeDetails: React.FC = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const { recipes, updateRating } = useContext(RecipeContext);
    const navigate = useNavigate();
    const [userRating, setUserRating] = useState<number>(5);

    const idNumber = recipeId ? parseInt(recipeId) : -1;
    const recipe = recipes.find(r => r.id === idNumber);

    if (!recipe) return (
        <div>
            <p>Nie znaleziono przepisu</p>
            <button className="random-btn" onClick={
                () => navigate("/")
            }>Wróć</button>
        </div>
    );

    const handleRateSubmit = () => {
        updateRating(recipe.id, userRating);
    };

    return (
        <div className="recipe-details">
            <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>← Powrót do listy</button>

            <h2>{recipe.name}</h2>
            <p><strong>Kuchnia:</strong> {recipe.cuisine}</p>
            <p><strong>Trudność:</strong> {recipe.difficulty}</p>

            <h3>Składniki:</h3>
            <ul>
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>

            <h3>Przepis:</h3>
            <ol>
                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>

            <div className="rating-section">
                <h3>Ocena: {parseFloat(recipe.rating.toFixed(1))} ⭐ ({recipe.reviewCount} głosów)</h3>
                <div style={{ marginTop: "10px" }}>
                    <label>Twoja ocena: </label>
                    <select
                        value={userRating}
                        onChange={(e) => setUserRating(parseInt(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button onClick={handleRateSubmit} style={{ marginLeft: "10px" }}>Dodaj ocenę</button>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <RecipeProvider>
            <Router>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<RecipeList />} />
                        <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
                    </Routes>
                </div>
            </Router>
        </RecipeProvider>
    );
}

export default App;