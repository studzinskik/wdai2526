import React, { useEffect, useState } from "react";
import { Komentarz, type KomentarzProps } from "./Komentarz";

export const Komentarze: React.FC = () => {
    const [comments, setComments] = useState<KomentarzProps[]>([]);

    useEffect(() => {
        fetch("https://dummyjson.com/comments")
            .then(res => res.json())
            .then(data => {
                setComments(data.comments);
            });
    }, []);

    return (
        <div>
            <h3>Komentarze</h3>
            {comments.map(c => (
                <Komentarz key={c.id} {...c} />
            ))}
        </div>
    );
};