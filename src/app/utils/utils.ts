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
  productCode?: string;
  buyLink?: string;
  sortiment?: string;
  tagLine?: string;
  producerUrl?: string;
  taste?: string | string[] | Record<string, unknown>;
  awards?: string;
  additionalInfo?: string;
  bottleVolume?: number;
  composition?: string;
  closure?: string;
  isNew?: boolean;
  organic?: boolean;
  featured?: boolean;
  availableOnlyOnline?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 3);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.concealedwines.fi";

  const productSchema = {
    "@context": "http://schema.org/",
    "@type": "Product",
    url: `${baseUrl}/viinit-luettelo/${product?.slug}`,
    name: product?.title,
    image: product?.largeImage || `${baseUrl}/default-wine-image.webp`,
    description: product?.producerDescription || product?.tagLine,
    productID: product?.productCode || "",
    sku: product?.productCode || "",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/viinit-luettelo/${product?.slug}`,
      priceCurrency: "EUR",
      price: product?.price,
      availability: product?.buyLink ? "InStock" : "OutOfStock",
      ...(product?.buyLink && { itemCondition: "NewCondition" }),
      priceValidUntil: validUntil.toISOString().split("T")[0],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        merchantReturnDays: 0,
        returnPolicyCategory: "MerchantReturnNotPermitted",
        returnMethod: "ReturnNotPermitted",
        applicableCountry: "FI",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          currency: "EUR",
          value: 0,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "FI",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: 0,
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "d",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4,
      reviewCount: 1,
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Concealed Wines",
        },
        reviewBody: `${product?.tagLine || "Fantastic wine!"} ${
          product?.producerDescription || ""
        }`,
      },
    ],

    // Use producerUrl if available or extract producer name somehow
    ...(product?.producerUrl && {
      brand: {
        "@type": "Brand",
        name: product.producerUrl.split("/").pop() || "Wine Producer",
      },
    }),
    ...(product?.region && {
      countryOfOrigin: {
        "@type": "Country",
        name: product.region,
      },
    }),
  };
  return JSON.stringify(productSchema);
}
