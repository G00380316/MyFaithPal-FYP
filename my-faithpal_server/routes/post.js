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
        else if (!content) {
            newPost = await Post.create({ user, media });
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

router.post('/update/likes', async (req, res) => {

    const { postId, likes } = req.body;

    try {

        const updatedPost = await Post.findByIdAndUpdate(postId, { likes }, { new: true });

        res.status(200).json(updatedPost);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/update/saves', async (req, res) => {

    const { postId, saves } = req.body;

    try {

        const updatedPost = await Post.findByIdAndUpdate(postId, { saves }, { new: true });

        res.status(200).json(updatedPost);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/byUserId', async (req, res) => {

    const { userId } = req.body;

    try {

        const userPosts = await Post.find({ user: userId });

        res.status(200).json(userPosts);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/byId', async (req, res) => {

    const { postId } = req.body;

    try {

        const post = await Post.findById(postId);

        res.status(200).json(post);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/delete', async (req, res) => {

    const { postId } = req.body;

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
