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
import { MenuIcon, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "#about" },
  { name: "Wines", href: "/viinit-luettelo" },
  { name: "Wine Articles", href: "/viini-artikkelit" },
  { name: "Contact Us", href: "/ota-yhteytta" },
  { name: "In English", href: "/in-english" },
];

export default function Navbar() {
  const session = useSession();
  const role = session?.data?.user?.role;

  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

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
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  prefetch={false}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden lg:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`relative group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors focus:bg-gray-100 focus:text-gray-900`}
          >
            {item.name}
            <span
              className={`absolute bottom-0 left-1/2 h-0.5 w-1/2 bg-black scale-x-0 -translate-x-1/2 transition-transform duration-300 ease-in-out group-hover:scale-x-100 ${
                pathname === item.href ? "scale-x-100" : ""
              }`}
            />
          </Link>
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
