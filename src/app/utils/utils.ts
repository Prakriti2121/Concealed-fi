interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Post {
  title: string;
  slug: string;
  featuredImage?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  author?: string;
  metaDesc?: string;
}

interface TeamMember {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

interface Product {
  title: string;
  slug: string;
  vintage: string;
  price: number;
  largeImage?: string;
  region?: string;
  producerDescription?: string;
  alcohol?: number;
}

export function breadcrumbSchemaGenerator(array: BreadcrumbItem[]): string {
  // Get base URL from environment or use default
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.concealed-wines.fi";

  const breadcrumbs = {
    "@context": "http://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Concealed Wines",
        item: baseUrl,
      },
      ...array.map((item, index) => {
        return {
          "@type": "ListItem",
          position: index + 2,
          name: item.name,
          item: item.url,
        };
      }),
    ],
  };
  return JSON.stringify(breadcrumbs);
}

export function postSchemaGenerator(post: Post): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.concealed-wines.fi";

  const postSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/viini-artikkelit/${post.slug}/`,
    },
    headline: `${post.title}`,
    image: post?.featuredImage || `${baseUrl}/cardimage.webp`,
    datePublished: post?.createdAt,
    dateModified: post?.updatedAt || post?.createdAt,
    author: {
      "@type": "Person",
      name: post?.author || "Concealed Wines",
      url: `${baseUrl}/viini-artikkelit/`,
    },
    publisher: {
      "@type": "Organization",
      name: "Concealed Wines",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/concealedlogo.webp`,
      },
    },
    description: post?.metaDesc || "",
    url: `${baseUrl}/viini-artikkelit/${post.slug}/`,
  };
  return JSON.stringify(postSchema);
}

export function profilePageSchemaGenerator(profile: TeamMember): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.concealed-wines.fi";

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name || "Concealed Wines",
    description: profile?.description || "",
    url: `${baseUrl}/tiimimme/${profile.id}/`,
    mainEntityOfPage: {
      "@type": "ProfilePage",
      "@id": `${baseUrl}/tiimimme/${profile.id}/`,
      name: profile?.name,
      description: profile?.description || "",
    },
    image: {
      "@type": "ImageObject",
      "@id": `${baseUrl}/tiimimme/${profile.id}/`,
      url: profile.image || `${baseUrl}/concealedlogo.webp`,
      caption: profile?.name,
    },
    worksFor: {
      "@type": "Organization",
      name: "Concealed Wines",
    },
  };
  return JSON.stringify(profileSchema);
}

export function productSchemaGenerator(product: Product): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.concealed-wines.fi";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} ${product.vintage}`,
    description: product.producerDescription || "",
    image: product.largeImage || `${baseUrl}/wine-placeholder.webp`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/viinit-luettelo/${product.slug}/`,
    },
    brand: {
      "@type": "Brand",
      name: product.title.split(" ")[0] || "Wine Brand",
    },
    category: "Alcoholic Beverage",
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "alcoholContent",
        value: `${product.alcohol}%`,
      },
      {
        "@type": "PropertyValue",
        name: "region",
        value: product.region || "",
      },
    ],
  };
  return JSON.stringify(productSchema);
}

export function formatDate(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || "";
  return text.substring(0, maxLength) + "...";
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
