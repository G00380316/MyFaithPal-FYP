import express from 'express';
import Post from '../models/post.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const posts = await Post.find();

        res.status(200).json(posts);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/create', async (req, res) => {
    const { user, content, media } = req.body;

    try {
        var newPost;

        if (!media) {
            newPost = await Post.create({ user, content });
        }
        else if (media){
            newPost = await Post.create({ user, content, media });
        }

        res.status(201).json(newPost);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/update/:postId', async (req, res) => {

    const { postId } = req.params;
    const { content, likes } = req.body;

    try {

        const updatedPost = await Post.findByIdAndUpdate(postId, { content, likes }, { new: true });

        res.status(200).json(updatedPost);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

// GET find all posts for a specific user
router.get('/user/:userId', async (req, res) => {

    const { userId } = req.params;

    try {

        const userPosts = await Post.find({ user: userId });

        res.status(200).json(userPosts);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

// GET find a specific post by ID
router.get('/:postId', async (req, res) => {

    const { postId } = req.params;

    try {

        const post = await Post.findById(postId);

        res.status(200).json(post);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

// DELETE a post by ID
router.delete('/:postId', async (req, res) => {

    const { postId } = req.params;

    try {

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });
        
    }
});


export default router;
