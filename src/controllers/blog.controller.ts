import { Request, Response } from "express";
import prisma from "../config/db";
import { sendMail } from "../utils/email";
import { generateUniqueSlug } from "../utils/slugify";

export const createBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content, authorId, categoryId } = req.body;
    const imagePath = req.file?.path;
    const imageFileName = req.file?.filename;

    if (!title || !content || !authorId || !categoryId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });
    if (!categoryExists) {
      res.status(400).json({ error: "Category does not exist" });
      return;
    }

    const slug = await generateUniqueSlug(title, prisma.blog);

    let imageRecord = null;
    if (imagePath && imageFileName) {
      imageRecord = await prisma.image.findUnique({
        where: { filename: imageFileName },
      });

      if (!imageRecord) {
        imageRecord = await prisma.image.create({
          data: {
            url: `/uploads/${imageFileName}`,
            filename: imageFileName,
            path: imagePath,
          },
        });
      }
    }
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        ...(imageRecord && { imageId: imageRecord.id }),
        authorId: parseInt(authorId),
        category: { connect: { id: parseInt(categoryId) } },
        slug,
      },
      include: {
        author: { select: { username: true } },
        category: true,
        image: true,
      },
    });
    res.status(201).json(blog);
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ error: "Failed to create blog" + error });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    // console.log(userRole);

    const blogs = await prisma.blog.findMany({
      where: userRole === "ADMIN" ? {} : { ispublished: true },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        comments: true,
        likes: true,
        image: true,
      },
    });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

export const getBlogById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(req.params.id),
        ispublished: true,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
        },
        likes: {
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
        },
        image: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, ispublished } = req.body;
    const { id } = req.params;
    const imagePath = req.file?.path;
    const imageFileName = req.file?.filename;
    // const image = req.file?.path;

    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id) },
      include: { image: true },
    });

    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    // ✅ Role-based check for publish/unpublish
    if (ispublished !== undefined && (!req.user || req.user.role !== "ADMIN")) {
      res.status(403).json({ error: "Only ADMIN can publish/unpublish blogs" });
      return;
    }

    // ✅ Check if it’s a new publish action
    const isNowPublishing = ispublished === true || ispublished === "true";
    // const wasPreviouslyUnpublished = blog.ispublished === false;

    // Handle image update
    let imageUpdate = {};
    if (imagePath && imageFileName) {
      let imageRecord = await prisma.image.findUnique({
        where: { filename: imageFileName },
      });

      if (!imageRecord) {
        imageRecord = await prisma.image.create({
          data: {
            url: `/uploads/${imageFileName}`,
            filename: imageFileName,
            path: imagePath,
          },
        });
      }

      imageUpdate = { imageId: imageRecord.id };

      // Clean up old image if it's no longer used
      if (blog.imageId) {
        const oldImage = await prisma.image.findUnique({
          where: { id: blog.imageId },
          include: { blogs: true },
        });

        if (
          oldImage &&
          oldImage.blogs.length === 1 &&
          oldImage.blogs[0].id === blog.id
        ) {
          await prisma.image.delete({ where: { id: blog.imageId } });
          // Optionally delete the file from storage here
        }
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...imageUpdate,
        ...(ispublished !== undefined && { ispublished: isNowPublishing }),
      },
      include: {
        author: { select: { id: true, email: true, username: true } },
        image: true, // Include image in response
      },
    });

    if (isNowPublishing && updatedBlog.author?.email) {
      console.log("sending mail");
      await sendMail(
        updatedBlog.author.email,
        "🎉 Your blog has been published!",
        `<p>Hello ${updatedBlog.author.username},</p>
          <p>Your blog titled "<strong>${updatedBlog.title}</strong>" has just been published!</p>
         <p><a href="http://localhost:8000/api/blog/slug/${updatedBlog.slug}">View it here</a></p>`
      );
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog" + error });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id) },
    });

    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    await prisma.blog.delete({
      where: { id: parseInt(id) },
    });
    console.log("Blog deleted");
    res.status(200).json({ message: "Blog deleted successfully" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

export const publishBlog = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const blog = await prisma.blog.update({
      where: { id: parseInt(req.params.id) },
      data: { ispublished: true },
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to publish blog" });
  }
};

export const unpublishBlog = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const blog = await prisma.blog.update({
      where: { id: parseInt(req.params.id) },
      data: { ispublished: false },
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to unpublish blog" });
  }
};

export const getUnpublishedBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { ispublished: false },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unpublished blogs" });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: { select: { username: true } },
        category: true,
        image: true,
      },
    });

    if (!blog || !blog.ispublished) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};
