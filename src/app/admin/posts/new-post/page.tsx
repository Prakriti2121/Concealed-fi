import { PrismaClient } from "@prisma/client";
import NewPost from "../components/NewPosts";

const prisma = new PrismaClient();

export default async function NewPostPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <NewPost posts={posts} />;
}
