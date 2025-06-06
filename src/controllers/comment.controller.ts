import { Request, Response } from 'express';
import prisma from '../config/db';

export const createComment = async (req: Request, res: Response) => {
    try {
      const { content, authorId, blogId } = req.body;
      
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: parseInt(authorId),
          blogId: parseInt(blogId)
        }
      });
      
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  };

  export const deleteComment = async (req: Request, res: Response) => {
    try {
      await prisma.comment.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  };