"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../components/sidebarcontent";

interface PageData {
  title: string;
  content: string;
  imageUrl: string;
}

export function ProfileContent() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch("/api/yrityksen-profiili");
        if (!response.ok) {
          throw new Error("Failed to fetch page data");
        }
        const data = await response.json();
        setPageData(data);
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPageData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto my-6 px-4">
        {/* Skeleton breadcrumb */}
        <div className="h-6 w-64 bg-secondary rounded-md animate-pulse mb-4" />
        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Main Content skeleton - 3/4 width */}
          <div className="w-full md:w-3/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 w-full">
                    {/* Title skeleton */}
                    <div className="flex items-center gap-2">
                      <div className="h-7 bg-secondary rounded-md w-3/5 animate-pulse" />
                    </div>

                    {/* Image skeleton - matches the wine glasses image */}
                    <div className="my-6 flex justify-center">
                      <div className="w-full max-w-md h-72 bg-secondary rounded-md animate-pulse" />
                    </div>

                    {/* Content paragraph skeletons */}
                    <div className="space-y-3">
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-5/6 animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-4/5 animate-pulse" />
                    </div>

                    {/* Additional paragraph with gap */}
                    <div className="space-y-3 mt-4">
                      <div className="h-4 bg-secondary rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-secondary rounded-md w-3/4 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Share button skeleton */}
                <div className="mt-6 flex gap-2">
                  <div className="h-9 w-24 bg-secondary rounded-md animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar placeholder - actual SidebarContent component has its own loading state */}
          <div className="w-full md:w-1/4 md:sticky md:top-6 md:self-start">
            <SidebarContent limit={6} />
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return <div>Error loading page data</div>;
  }

  // Get the current URL (client-side)
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="container mx-auto my-6 px-4">
      <BreadCrumb title1={pageData.title} />
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Main Content - Take 3/4 of the width on medium screens and up */}
        <div className="w-full md:w-3/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-black dark:text-gray-200">
                      {pageData.title}
                    </h2>
                  </div>
                  <div
                    className="text-gray-700 dark:text-gray-300 leading-relaxed content"
                    dangerouslySetInnerHTML={{ __html: pageData.content }}
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="flex space-x-2">
                      <FacebookShareButton
                        url={currentUrl}
                        title={pageData.title}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Facebook className="h-4 w-4" />
                          <span className="sr-only">Share on Facebook</span>
                        </Button>
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={currentUrl}
                        title={pageData.title}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Twitter className="h-4 w-4" />
                          <span className="sr-only">Share on Twitter</span>
                        </Button>
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={currentUrl}
                        title={pageData.title}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="sr-only">Share on LinkedIn</span>
                        </Button>
                      </LinkedinShareButton>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Take 1/4 of the width on medium screens and up */}
        <div className="w-full md:w-1/4 md:sticky md:top-6 md:self-start">
          <SidebarContent limit={6} />
        </div>
      </div>
    </div>
  );
}
