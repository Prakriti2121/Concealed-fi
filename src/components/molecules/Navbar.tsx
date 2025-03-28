"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, User, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "#about", hasDropdown: true },
  { name: "Wines", href: "/viinit-luettelo" },
  { name: "Wine Articles", href: "/viini-artikkelit" },
  { name: "Contact Us", href: "/ota-yhteytta" },
  { name: "In English", href: "/in-english" },
];

const aboutUsSubItems = [
  { name: "Company Profile", href: "/yrityksen-profiili" },
  { name: "Our Teams", href: "/tiimimme" },
];

export default function Navbar() {
  const session = useSession();
  const role = session?.data?.user?.role;
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const toggleSubmenu = (name: string) => {
    if (openSubmenu === name) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(name);
    }
  };

  return (
    <header className="flex h-20 w-full items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center" prefetch={false}>
        <div>
          <Image
            src="/images/winelogo.webp"
            width={150}
            height={150}
            alt="Logo"
            className="filter invert dark:invert-0"
          />
        </div>
      </Link>

      {/* Mobile Menu */}
      <div className="ml-auto lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            {/* Visible title for accessibility */}
            <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
            <div className="grid gap-2 py-6">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className="flex w-full items-center justify-between py-2 text-lg font-semibold"
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSubmenu === item.name && (
                        <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                          {aboutUsSubItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block py-2 text-base"
                              prefetch={false}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      prefetch={false}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden lg:flex items-center gap-6">
        {navItems.map((item) => (
          <div key={item.name} className="relative">
            {item.hasDropdown ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`group inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors focus:bg-gray-100 focus:text-gray-900`}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                    <span
                      className={`absolute bottom-0 left-1/2 h-0.5 w-1/2 bg-black scale-x-0 -translate-x-1/2 transition-transform duration-300 ease-in-out group-hover:scale-x-100`}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {aboutUsSubItems.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link
                        href={subItem.href}
                        className="w-full cursor-pointer"
                        prefetch={false}
                      >
                        {subItem.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={item.href}
                className={`relative group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors focus:bg-gray-100 focus:text-gray-900`}
                prefetch={false}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 w-1/2 bg-black scale-x-0 -translate-x-1/2 transition-transform duration-300 ease-in-out group-hover:scale-x-100 ${
                    pathname === item.href ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            )}
          </div>
        ))}
        {role === "ADMIN" && (
          <Link href={"/admin/dashboard"} className="cursor-pointer">
            <User className="h-6 w-6" />
          </Link>
        )}
      </nav>
    </header>
  );
}
