import React, { useState } from "react";

interface User {
    id: number;
    username: string;
    fullName: string;
}

export interface KomentarzProps {
    id: number;
    body: string;
    postId: number;
    likes: number;
    user: User;
}

export const Komentarz: React.FC<KomentarzProps> = ({ id, body, likes, user }) => {
    const [likeCount, setLikeCount] = useState(likes);

    return (
        <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h4>User: {user.username} (ID: {id})</h4>
            <p>{body}</p>
            <div>
                Likes: {likeCount} 
                <button onClick={() => setLikeCount(likeCount + 1)}>👍</button>
                <button onClick={() => setLikeCount(likeCount - 1)}>👎</button>
            </div>
        </div>
    );
};