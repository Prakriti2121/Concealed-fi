import { type MetadataRoute } from "next";
import prisma from "../../prisma/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_BASE_URL!;

  // Fetch all your tables in parallel
  const [products, posts, pages, teamMembers] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, slug: true, updatedAt: true },
    }),
    prisma.post.findMany({
      // where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.page.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.teamMember.findMany({
      select: { id: true, updatedAt: true },
    }),
  ]);

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/viinit-luettelo`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ota-yhteytta`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/viini-artikkelit`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/yrityksen-profiili`,
      lastModified: new Date(),
      priority: 0.6,
    },
    {
      url: `${baseUrl}/in-english`,
      lastModified: new Date(),
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tiimimme`,
      lastModified: new Date(),
      priority: 0.6,
    },
  ];

  // Dynamic routes
  const dynamicRoutes = [
    // Wine products
    ...products.map((product) => ({
      url: `${baseUrl}/viinit-luettelo/${product.slug}`,
      lastModified: product.updatedAt,
      changefreq: "weekly",
      priority: 0.9,
    })),

    // Wine  posts
    ...posts.map((post) => ({
      url: `${baseUrl}/viini-artikkelit/${post.slug}`,
      lastModified: post.updatedAt,
      changefreq: "weekly",
      priority: 0.7,
    })),

    // Pages - filtering out pages that already have dedicated routes
    ...pages
      .filter(
        (page) =>
          !staticRoutes.some((route) => route.url.endsWith(`/${page.slug}`))
      )
      .map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt,
        changefreq: "monthly",
        priority: 0.7,
      })),

    // Team members
    ...teamMembers.map((member) => ({
      url: `${baseUrl}/tiimimme/${member.id}`,
      lastModified: member.updatedAt,
      changefreq: "monthly",
      priority: 0.5,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
