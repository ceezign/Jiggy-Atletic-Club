import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { ok } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

const router = Router();

// GET /api/blog?category=&search=
router.get(
  "/blog",
  asyncHandler(async (req, res) => {
    const { category, search } = req.query as { category?: string; search?: string };
    const posts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        ...(category ? { category } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: "desc" },
    });
    return ok(res, posts);
  })
);

router.get(
  "/blog/:slug",
  asyncHandler(async (req, res) => {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!post || !post.isPublished) throw new AppError(404, "Article not found.");
    return ok(res, post);
  })
);

// GET /api/testimonials
router.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return ok(res, testimonials);
  })
);

// GET /api/gallery
router.get(
  "/gallery",
  asyncHandler(async (_req, res) => {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });
    return ok(res, images);
  })
);

export default router;
