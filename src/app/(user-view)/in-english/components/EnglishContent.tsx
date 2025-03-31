"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BreadCrumb from "../../../(user-view)/components/breadcrumb/breadcrumb";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
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
import SidebarContent from "../../../(user-view)/components/sidebarcontent";

interface PageData {
  title: string;
  content: string;
}

export default function EnglishContent() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch("/api/in-english");
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
    return <div>Loading....</div>;
  }

  if (!pageData) {
    return <div>Error loading page data</div>;
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="container mx-auto my-6 px-4">
      <BreadCrumb title1={pageData.title} />
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Main Content*/}
        <div className="w-full md:w-3/4">
          <Card>
            <CardContent className="p-6 my-6">
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

        {/* Sidebar */}
        <div className="w-full md:w-1/4 md:sticky md:top-6 md:self-start">
          <SidebarContent limit={6} />
        </div>
      </div>
    </div>
  );
}
