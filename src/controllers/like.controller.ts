import { Request, Response } from 'express';
import prisma from '../config/db';

export const likeBlog = async (req: Request, res: Response) : Promise<any>=> {
  try {
    const { authorId, blogId } = req.body;

    if (!authorId || !blogId) {
      res.status(400).json({ error: 'authorId and blogId are required' });
      return;
    }

    const blogExists = await prisma.blog.findUnique({
      where: { id: parseInt(blogId) }
    });

    if (!blogExists) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }
    
    const existingLike = await prisma.like.findFirst({
      where: {
        authorId: parseInt(authorId),
        blogId: parseInt(blogId)
      }
    });
    
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return res.json({ message: 'Like removed' });
    }
    
    const like = await prisma.like.create({
      data: {
        authorId: parseInt(authorId),
        blogId: parseInt(blogId)
      }
    });
    
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like blog' });
  }
};


export const getBlogLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      res.status(400).json({ error: 'blogId is required' });
      return;
    }

    const blogExists = await prisma.blog.findUnique({
      where: { id: parseInt(blogId) }
    });

    if (!blogExists) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    const [totalLikes, likesData] = await prisma.$transaction([
      prisma.like.count({
        where: { blogId: parseInt(blogId) }
      }),
      prisma.like.findMany({
        where: { blogId: parseInt(blogId) },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc' 
        }
      })
    ]);

    res.status(200).json({
      success: true,
      totalLikes,
      likes: likesData
    });

  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch likes' 
    });
  }
};