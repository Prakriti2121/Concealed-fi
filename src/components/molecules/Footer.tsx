"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full p-8 bg-black mt-44">
      <div className="text-white container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          {/* Sweden Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium border-b border-gray-700 pb-2 mb-4">
              Concealed Wines Sweden
            </h3>
            <div className="space-y-2 text-sm">
              <p>Concealed Wines AB (556770-1585).</p>
              <p>Bo Bergmans gata 14, 115 50</p>
              <p>Stockholm, Sweden</p>
              <p>Telephone: +46 8-410 244 34</p>
              <p>
                Email:{" "}
                <Link
                  href="mailto:info@concealedwines.com"
                  className="hover:underline"
                >
                  info@concealedwines.com
                </Link>
              </p>
            </div>
          </div>

          {/* Norway Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium border-b border-gray-700 pb-2 mb-4">
              Concealed Wines Norway
            </h3>
            <div className="space-y-2 text-sm">
              <p>Concealed Wines NUF (996 166 651).</p>
              <p>Ulvenveien 88 c/o Krogsvold Smith,</p>
              <p>0581 Oslo, Norway</p>
              <p>Telephone: +46 8-410 244 34</p>
              <p>
                Email:{" "}
                <Link
                  href="mailto:info@concealedwines.no"
                  className="hover:underline"
                >
                  info@concealedwines.no
                </Link>
              </p>
            </div>
          </div>

          {/* Finland Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium border-b border-gray-700 pb-2 mb-4">
              Concealed Wines Finland
            </h3>
            <div className="space-y-2 text-sm">
              <p>Concealed Wines OY (2506194-2).</p>
              <p>Närpesvägen 25 c/o Best bokföring ,</p>
              <p>64200 Närpes, Finland</p>
              <p>Telefon: +46 8-410 244 34</p>
              <p>
                Email:{" "}
                <Link
                  href="mailto:info@concealedwines.fi"
                  className="hover:underline"
                >
                  info@concealedwines.fi
                </Link>
              </p>
            </div>
          </div>

          {/* Kuluttajille Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium border-b border-gray-700 pb-2 mb-4">
              Kuluttajille
            </h3>
            <div className="space-y-2">
              <p>
                <Link
                  href="#"
                  className="flex items-center hover:underline"
                  prefetch={false}
                >
                  <Image
                    src="/images/sweden-flag.png"
                    alt="Sweden Flag"
                    width={20}
                    height={12}
                    className="mr-2"
                  />
                  Concealed Wines Sweden
                </Link>
              </p>
              <p>
                <Link
                  href="#"
                  className="flex items-center hover:underline"
                  prefetch={false}
                >
                  <Image
                    src="/images/Norge.jpg"
                    alt="Norway Flag"
                    width={20}
                    height={12}
                    className="mr-2"
                  />
                  Concealed Wines Norway
                </Link>
              </p>
              <p>
                <Link
                  href="#"
                  className="flex items-center hover:underline"
                  prefetch={false}
                >
                  <Image
                    src="/images/finlan.jpg"
                    alt="Finland Flag"
                    width={20}
                    height={12}
                    className="mr-2"
                  />
                  Concealed Wines Finland
                </Link>
              </p>
            </div>

            {/* Wine Tourism Logo */}
            <div className="mt-6">
              <Link
                href="https://winetourism.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/images/winetourismlogo.png"
                  width={200}
                  height={60}
                  alt="Wine Tourism"
                  className="max-w-full"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t border-gray-800 text-xs text-center">
          <p>
            © 2025s U-Design is proudly powered by Nextjs | Entries (RSS) |
            Comments (RSS)
          </p>
        </div>
      </div>
    </footer>
  );
}
