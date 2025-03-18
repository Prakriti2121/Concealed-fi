"use client";
import React, { useState, useEffect } from "react";

import {
  Calendar,
  Home,
  Inbox,
  Search,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Products",
    url: "#", // a valid link (replace with your route)
    icon: Inbox,
    children: [
      { title: "View Products", url: "/admin/wines" },
      { title: "Add Product", url: "/admin/add-wines" },
    ],
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
    children: [
      { title: "Settings", url: "#" },
      {
        title: "Logout",
        url: "#",
        onClick: () => signOut({ callbackUrl: "/" }), // Add signOut function with redirect
      },
    ],
  },
];

export function AppSidebar() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => (prev === title ? null : title));
  };

  if (!isClient) {
    return null; // or return a loading spinner or skeleton
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Concealed Wines</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    <div className="flex items-center justify-between w-full my-2">
                      {item.url !== "#" ? (
                        <Link
                          href={item.url}
                          className="flex items-center space-x-2 flex-1"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            if (item.children) {
                              toggleExpand(item.title);
                            }
                          }}
                          className="flex items-center space-x-2 flex-1"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </button>
                      )}

                      {item.children && (
                        <button
                          onClick={() => toggleExpand(item.title)}
                          className="ml-2"
                        >
                          {expanded === item.title ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </button>
                      )}
                    </div>
                  </SidebarMenuItem>

                  {/* Render children outside of parent SidebarMenuItem */}
                  {item.children && expanded === item.title && (
                    <div className="ml-6 mt-2">
                      {item.children.map((child) => (
                        <div key={child.title} className="py-1">
                          {child.onClick ? (
                            <button
                              onClick={child.onClick}
                              className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                            >
                              <span>{child.title}</span>
                            </button>
                          ) : (
                            <Link
                              href={child.url}
                              className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                            >
                              <span>{child.title}</span>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
