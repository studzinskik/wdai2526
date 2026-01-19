import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Article } from "./components/blog/BlogTypes";
import { Licznik2 } from "./components/liczniki/Licznik2";

// --- Components for Blog ---

const Home = () => (
    <div>
        <h1>Witamy w naszym serwisie!</h1>
        <Link to="/blog">Przejdź do Bloga</Link>
        <br />
        <Link to="/licznik">Zadanie 8.1</Link>
    </div>
);

const BlogList = () => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("articles");
        if (stored) setArticles(JSON.parse(stored));
    }, []);

    return (
        <div>
            <h2>Lista Artykułów</h2>
            <ul>
                {articles.map(art => (
                    <li key={art.id}>
                        <Link to={`/article/${art.id}`}>{art.title}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/dodaj">Dodaj nowy artykuł</Link>
        </div>
    );
};

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("articles");
        if (stored) {
            const articles: Article[] = JSON.parse(stored);
            const found = articles.find(a => a.id === Number(id));
            if (found) setArticle(found);
        }
    }, [id]);

    if (!article) return <div>Nie znaleziono artykułu.</div>;

    return (
        <div>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
            <Link to="/blog">Powrót</Link>
        </div>
    );
};

const AddArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleAdd = () => {
        const newArticle: Article = {
            id: Date.now(),
            title,
            content
        };

        const stored = localStorage.getItem("articles");
        const articles: Article[] = stored ? JSON.parse(stored) : [];
        articles.push(newArticle);

        localStorage.setItem("articles", JSON.stringify(articles));
        navigate("/blog");
    };

    return (
        <div>
            <h2>Dodaj Artykuł</h2>
            <input placeholder="Tytuł" value={title} onChange={e => setTitle(e.target.value)} />
            <br />
            <textarea placeholder="Treść" value={content} onChange={e => setContent(e.target.value)} />
            <br />
            <button onClick={handleAdd}>DODAJ</button>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <div className="App" style={{ padding: "20px" }}>
                <nav style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
                    <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
                    <Link to="/blog" style={{ marginRight: "10px" }}>Blog</Link>
                    <Link to="/dodaj">Dodaj Artykuł</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/article/:id" element={<ArticleDetail />} />
                    <Route path="/dodaj" element={<AddArticle />} />
                    <Route path="/licznik" element={<Licznik2 />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;