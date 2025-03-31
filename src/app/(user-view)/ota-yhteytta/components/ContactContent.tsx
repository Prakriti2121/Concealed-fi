"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../../(user-view)/components/sidebarcontent";
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

interface PageData {
  title: string;
  content: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactContent() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch("/api/ota-yhteytta");
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      alert("Email sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading..</div>;
  }

  if (!pageData) {
    return <div>Error loading page data</div>;
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="max-w-6xl mx-auto container">
      <BreadCrumb title1={pageData.title} />
      <div className="flex flex-col md:flex-row gap-8 my-6">
        {/* Main Contact Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-8">
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

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-black dark:text-gray-200 mb-4">
                  Contact Us
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 md:sticky md:top-6 md:self-start">
          <SidebarContent limit={6} />
        </div>
      </div>
    </div>
  );
}
