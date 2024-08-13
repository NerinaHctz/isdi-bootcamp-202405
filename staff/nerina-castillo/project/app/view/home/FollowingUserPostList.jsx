import { useState, useEffect } from 'react'
import logic from '../../logic'
import Post from './Post'

export default function FollowingPostList() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        loadPosts()
    }, [])

    const handlePostDeleted = () => loadPosts()

    const handlePostLikeToggled = () => loadPosts()

    const handleUserFollowToggled = () => loadPosts()

    const loadPosts = () => {
        try {
            logic.getAllFollowingUserPosts()
                .then(posts => setPosts(posts))
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    return <section>
        {posts.map(post => <Post
            key={post.id}
            post={post}
            onPostDeleted={handlePostDeleted}
            onPostLikeToggled={handlePostLikeToggled}
            onUserFollowToggled={handleUserFollowToggled}
        />)}
    </section>
}