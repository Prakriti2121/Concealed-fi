"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../components/sidebarcontent";
// import { TeamContentSkeleton } from "@/components/skeleton/TeamContentSkeleton";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string | null;
  createdAt: string;
}

interface ApiResponse {
  items: TeamMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function TeamContent() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const res = await fetch("/api/team");
        if (!res.ok) {
          throw new Error(
            `Failed to fetch team members: ${res.status} ${res.statusText}`
          );
        }
        const data: ApiResponse = await res.json();
        setTeamMembers(data.items);
      } catch (err: unknown) {
        console.error("Error fetching team members:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <div>Loading..</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] py-8 sm:py-12 md:py-16">
        <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mx-4">
          <p className="text-red-600 dark:text-red-400 font-medium text-sm sm:text-base">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-6 px-4">
      <BreadCrumb title1="Tiimimme" />
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Main Content - Take 2/3 of the width on medium screens and up */}
        <div className="w-full md:w-3/4">
          <div className="grid gap-6 sm:gap-8 md:gap-10">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="relative w-full sm:w-1/3 h-64 sm:h-auto">
                    {member.image ? (
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="object-center"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 25vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 text-base sm:text-lg">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                    <CardHeader className="p-0 pb-2 sm:pb-3">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
                        {member.name}
                      </CardTitle>
                      <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-1">
                        {member.role}
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {member.description}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar - Take 1/3 of the width on medium screens and up */}
        <div className="w-full md:w-1/4 md:sticky md:top-6 md:self-start">
          <SidebarContent limit={6} />
        </div>
      </div>
    </div>
  );
}
