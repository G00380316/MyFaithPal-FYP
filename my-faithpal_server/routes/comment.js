import express from 'express';
import Comment from '../models/comment.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const comments = await Comment.find();

        res.status(200).json(comments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/findById', async (req, res) => {

    const { _id } = req.body;

    try {

        const comment = await Comment.findById({_id});

        res.status(200).json(comment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/findByPost', async (req, res) => {

    const { post } = req.body;

    try {

        const comments = await Comment.find({post});

        res.status(200).json(comments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/create', async (req, res) => {
    const { post, user, content, sendername , senderimage } = req.body;

    try {

        const newComment = await Comment.create({ post, user, content , sendername, senderimage});

        res.status(201).json(newComment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/update/like', async (req, res) => {

    const { likes, commentId } = req.body;

    try {

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { likes }, { new: true });

        res.status(200).json(updatedComment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/update/content', async (req, res) => {

    const { content, commentId } = req.body;

    try {

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });

        res.status(200).json(updatedComment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete', async (req, res) => {
    
    const { commentId } = req.body;

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
