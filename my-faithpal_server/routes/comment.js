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

router.post('/create', async (req, res) => {
    const { post, user, content } = req.body;

    try {

        const newComment = await Comment.create({ post, user, content });

        res.status(201).json(newComment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST update a comment (e.g., update content)
router.post('/update/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });

        res.status(200).json(updatedComment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a comment by ID
router.delete('/:commentId', async (req, res) => {
    const { commentId } = req.params;

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
