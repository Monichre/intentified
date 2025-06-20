import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex flex-col justify-end h-64 relative">
      {/* Decorative borders */}
      <div className="absolute bottom-0 -right-6 w-80 h-0.5 bg-gradient-to-tr from-background via-neutral-800/50 to-neutral-800/50"></div>
      <div className="absolute bottom-0 -left-6 w-80 h-0.5 bg-gradient-to-tl from-background via-neutral-800/50 to-neutral-800/50"></div>
      <div className="absolute -bottom-4 -left-2 w-0.5 h-48 bg-gradient-to-t from-neutral-800/50 via-neutral-800/50 to-background"></div>
      <div className="absolute -bottom-4 -right-2 w-0.5 h-48 bg-gradient-to-t from-neutral-800/50 via-neutral-800/50 to-background"></div>

      {/* Craft Section */}
      <div className="relative flex justify-between flex-col px-1 py-2.5 items-end h-28">
        <Link href="/craft" className="flex flex-col text-end relative group cursor-pointer">
          <div className="absolute -inset-2 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 min-w-full min-h-full rounded-md bg-neutral-700/20 transition-all cursor-pointer pointer-events-none z-[2]"></div>
          <span className="flex justify-end items-center text-xs font-semibold text-neutral-500 font-geistMono relative z-[3]">
            <span>Craft</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </span>
          <p className="text-sm text-zinc-300 font-geistSans relative z-[3]">
            Experience unique and interactive designs.
          </p>
          <div className="absolute -bottom-3 -right-6 w-72 h-0.5 bg-gradient-to-tl from-neutral-800/50 via-neutral-800/50 to-background"></div>
        </Link>
      </div>

      {/* Contact Section */}
      <div className="relative flex justify-end flex-col px-1 py-2.5 w-full">
        <div className="absolute top-0 -left-6 w-52 h-0.5 bg-gradient-to-tr from-neutral-800/50 via-neutral-800/50 to-background"></div>
        <div className="absolute -top-7 flex left-1 space-x-2">
          <a
            className="text-white grayscale-1"
            target="_blank"
            href="https://github.com/R1ck404"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-neutral-500 font-geistMono">
            Contact me
          </p>
          <span className="text-sm text-zinc-300 font-geistSans">
            Reach me at{" "}
            <span className="relative group">
              <a
                className="relative z-[3] cursor-pointer"
                href="mailto:rickhuijser898@gmail.com"
              >
                rickhuijser898@gmail.com
              </a>
              <div className="absolute -inset-0.5 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 min-w-full min-h-full rounded-md bg-neutral-700/20 transition-all cursor-pointer pointer-events-none z-[2]"></div>
            </span>{" "}
            or @rick404.
          </span>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-xs text-neutral-800 absolute -bottom-5 right-0">
        © {new Date().getFullYear()} Rick Huijser. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
