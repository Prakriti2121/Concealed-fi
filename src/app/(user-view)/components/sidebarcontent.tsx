"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SidebarContentProps {
  limit?: number;
  excludeSlug?: string;
}
interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
}

export default function SidebarContent({
  limit,
  excludeSlug,
}: SidebarContentProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error(
            `Failed to fetch posts: ${res.status} ${res.statusText}`
          );
        }
        const data = await res.json();
        setPosts(data);
      } catch (error: unknown) {
        console.error("Error fetching posts:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const renderLatestNews = () => {
    if (loading) {
      return (
        <div className="p-4">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-medium">Viini Artikkelit</h3>
          </div>
          <div className="text-destructive text-sm">Error: {error}</div>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-medium">Viini Artikkelit</h3>
          </div>
          <div className="text-muted-foreground text-sm">No posts found.</div>
        </div>
      );
    }

    const filteredPosts = excludeSlug
      ? posts.filter((post) => post.slug !== excludeSlug)
      : posts;

    const displayedPosts = limit
      ? filteredPosts.slice(0, limit)
      : filteredPosts;

    return (
      <div className="space-y-3 md:space-y-4">
        {displayedPosts.map((post) => (
          <div
            key={post.id}
            className="group flex items-start justify-between gap-2 cursor-pointer border border-border rounded-lg p-2 md:p-2 hover:bg-secondary dark:hover:bg-secondary transition-colors"
            onClick={() => handleClick(post.slug)}
          >
            <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
              {post.title}
            </div>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground mt-0.5" />
          </div>
        ))}
      </div>
    );
  };

  const handleClick = (slug: string) => {
    router.push(`/viini-artikkelit/${slug}`);
  };

  return (
    <div className="w-full h-fit bg-background dark:bg-sidebar-background rounded-lg shadow-sm">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-medium mb-3">Meistä</h3>
          <div className="text-sm text-muted-foreground">
            <p>
              Concealed Wines on viinintoimittaja Pohjoisen markkinoilla. Meidän
              tavoite on toimittaa loistoviinejä kuluttajilla. Tällä hetkellä
              myymme muutamia loistoviinejä Suomen markkinoilla ja samaan aikaan
              tuomme uusia viinejä markkinoille.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-medium">Viini Artikkelit</h3>
        </div>
        {renderLatestNews()}

        <Separator className="my-8" />

        {/* Contact Information Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base md:text-lg font-medium">
              Concealed Wines Finland
            </h3>
          </div>

          <div className="space-y-5 text-sm">
            <p className="font-medium">Concealed Wines OY (2506194-2).</p>

            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <p>Närpesvägen 25 c/o Best bokföring ,</p>
                <p>64200 Närpes, Finland</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a
                href="tel:+4684102434"
                className="hover:text-primary transition-colors"
              >
                +46 8-410 244 34
              </a>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <a
                href="mailto:info@concealedwines.no"
                className="hover:text-primary transition-colors"
              >
                info@concealedwines.fi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
