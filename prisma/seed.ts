import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotnet from "dotenv";

dotnet.config();
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const SALT_ROUNDS = 10;

  // Clear existing data (be careful in production!)
  console.log('🧹 Clearing existing data...');
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: await bcrypt.hash('johnspassword', SALT_ROUNDS),
        role: 'USER'
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: await bcrypt.hash('janespassword', SALT_ROUNDS),
        role: 'USER'
      },
      {
        username: 'alice',
        email: 'alice@example.com',
        password: await bcrypt.hash('alicespassword', SALT_ROUNDS),
        role: 'USER'
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('adminpassword', SALT_ROUNDS),
        role: 'ADMIN'
      }
    ]
  });

  const [john, jane, alice, admin] = await prisma.user.findMany();

  // Create categories
  console.log('🏷️ Creating categories...');
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Technology',
        slug: 'technology'
      },
      {
        name: 'Travel',
        slug: 'travel'
      },
      {
        name: 'Food',
        slug: 'food'
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle'
      },
      {
        name: 'Programming',
        slug: 'programming'
      }
    ]
  });

  const [techCategory, travelCategory, foodCategory, lifestyleCategory, programmingCategory] = 
    await prisma.category.findMany();

  // Create blogs
  console.log('📝 Creating blogs...');
  const blogs = await prisma.blog.createMany({
    data: [
      {
        title: 'Getting Started with Prisma',
        slug: 'getting-started-with-prisma',
        content: `## Introduction to Prisma
Prisma is a modern database toolkit that makes working with databases easy...

## Key Features
- Type-safe database access
- Auto-generated query builder
- Schema migrations

## Conclusion
Start using Prisma today!`,
        authorId: john.id,
        image: 'prisma-blog.jpg'
      },
      {
        title: 'My Trip to Japan',
        slug: 'my-trip-to-japan',
        content: `## Arrival in Tokyo
The bustling streets of Shibuya were overwhelming...

## Cultural Experiences
- Traditional tea ceremony
- Visiting ancient temples
- Trying authentic sushi

## Final Thoughts
An unforgettable experience!`,
        authorId: jane.id,
        image: 'japan-trip.jpg'
      },
      {
        title: 'The Best Pizza in New York',
        slug: 'best-pizza-ny',
        content: `## Pizza Tour
I visited 20 pizzerias across NYC to find the best...

## Top 3 Picks
1. Joe's Pizza - Classic NY slice
2. Di Fara - Artisan quality
3. Lucali - Romantic atmosphere

## Honorable Mentions
Several other great spots worth visiting...`,
        authorId: admin.id
      },
      {
        title: 'Remote Work Lifestyle',
        slug: 'remote-work-lifestyle',
        content: `## My Remote Work Journey
After 3 years working remotely, here's what I learned...

## Pros and Cons
✅ Flexibility
✅ No commute
❌ Can be isolating
❌ Requires discipline`,
        authorId: alice.id,
        image: 'remote-work.jpg'
      },
      {
        title: 'TypeScript Tips and Tricks',
        slug: 'typescript-tips',
        content: `## Advanced TypeScript Patterns
Here are some lesser-known TypeScript features...

## Useful Examples
1. Mapped types
2. Conditional types
3. Template literal types

## When to Use
These patterns can help in complex codebases...`,
        authorId: john.id
      }
    ]
  });

  const [prismaBlog, japanBlog, pizzaBlog, remoteBlog, tsBlog] = await prisma.blog.findMany();

  // Assign categories to blogs
  console.log('🔗 Assigning categories to blogs...');
  await prisma.blogCategory.createMany({
    data: [
      // Prisma blog - tech and programming
      { blogId: prismaBlog.id, categoryId: techCategory.id },
      { blogId: prismaBlog.id, categoryId: programmingCategory.id },
      
      // Japan blog - travel and lifestyle
      { blogId: japanBlog.id, categoryId: travelCategory.id },
      { blogId: japanBlog.id, categoryId: lifestyleCategory.id },
      
      // Pizza blog - food
      { blogId: pizzaBlog.id, categoryId: foodCategory.id },
      
      // Remote work - lifestyle and tech
      { blogId: remoteBlog.id, categoryId: lifestyleCategory.id },
      { blogId: remoteBlog.id, categoryId: techCategory.id },
      
      // TypeScript - programming
      { blogId: tsBlog.id, categoryId: programmingCategory.id }
    ]
  });

  // Create comments
  console.log('💬 Creating comments...');
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great introduction to Prisma! Looking forward to more content.',
        authorId: jane.id,
        blogId: prismaBlog.id
      },
      {
        content: 'Have you tried the new Prisma migrations? They work great!',
        authorId: admin.id,
        blogId: prismaBlog.id
      },
      {
        content: 'I visited that same temple last year! Beautiful spot.',
        authorId: john.id,
        blogId: japanBlog.id
      },
      {
        content: 'You forgot to mention Lombardi\'s! Their coal oven pizza is amazing.',
        authorId: alice.id,
        blogId: pizzaBlog.id
      },
      {
        content: 'Great tips! I especially found the conditional types explanation helpful.',
        authorId: jane.id,
        blogId: tsBlog.id
      },
      {
        content: 'How do you deal with timezone differences in remote work?',
        authorId: john.id,
        blogId: remoteBlog.id
      }
    ]
  });

  // Create likes
  console.log('❤️ Creating likes...');
  await prisma.like.createMany({
    data: [
      // Prisma blog gets likes from Jane and Admin
      { authorId: jane.id, blogId: prismaBlog.id },
      { authorId: admin.id, blogId: prismaBlog.id },
      
      // Japan blog gets likes from John and Alice
      { authorId: john.id, blogId: japanBlog.id },
      { authorId: alice.id, blogId: japanBlog.id },
      
      // Pizza blog gets like from Jane
      { authorId: jane.id, blogId: pizzaBlog.id },
      
      // Remote work blog gets like from Admin
      { authorId: admin.id, blogId: remoteBlog.id },
      
      // TypeScript blog gets likes from all users
      { authorId: john.id, blogId: tsBlog.id },
      { authorId: jane.id, blogId: tsBlog.id },
      { authorId: alice.id, blogId: tsBlog.id },
      { authorId: admin.id, blogId: tsBlog.id }
    ]
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created:
- ${(await prisma.user.count())} users
- ${(await prisma.category.count())} categories
- ${(await prisma.blog.count())} blogs
- ${(await prisma.blogCategory.count())} blog-category relationships
- ${(await prisma.comment.count())} comments
- ${(await prisma.like.count())} likes`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed!');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });