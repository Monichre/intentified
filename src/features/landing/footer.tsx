"use client";

// External imports
import Link from "next/link";
import { Zap } from "lucide-react";
import Image from "next/image";
// Internal imports
import { XIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";

/**
 * FooterHeading component for consistent section headings
 */
const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
    {children}
  </h3>
);

/**
 * FooterLink component for consistent link styling
 */
const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
  >
    {children}
  </Link>
);

/**
 * Navigation data for footer links
 */
const navigation = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "API", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ],
  support: [
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#" },
  ],
  social: [
    {
      name: "X",
      href: "https://x.com/intentified",
      openInNewTab: true,
      icon: XIcon,
    },
    {
      name: "GitHub",
      href: "https://github.com/intentified",
      openInNewTab: true,
      icon: GitHubIcon,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/intentified",
      openInNewTab: true,
      icon: LinkedInIcon,
    },
  ],
};

/**
 * Main Footer component
 */
export function Footer() {
  return (
    <footer
      className="border-border/50 relative border-t"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Background elements */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-50"
        aria-hidden="true"
      ></div>
      <div
        className="bg-primary/10 absolute top-1/4 right-1/4 -z-10 h-64 w-64 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <FooterHeading>Product</FooterHeading>
                <ul className="mt-4 space-y-3">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <FooterLink href={item.href}>{item.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <FooterHeading>Company</FooterHeading>
                <ul className="mt-4 space-y-3">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <FooterLink href={item.href}>{item.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <FooterHeading>Support</FooterHeading>
                <ul className="mt-4 space-y-3">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <FooterLink href={item.href}>{item.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <FooterHeading>Legal</FooterHeading>
                <ul className="mt-4 space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <FooterLink href={item.href}>{item.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-center">
              <Image
                src="/logo-white.png"
                alt="Intentified"
                width={200}
                height={50}
              />
            </div>
            <p className="text-muted-foreground text-base">
              Transform intent into revenue with AI-powered marketing
              intelligence.
            </p>
            <div className="flex space-x-5">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label={item.name}
                  target={item.openInNewTab ? "_blank" : "_self"}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-border/50 mt-12 border-t pt-8">
          <p className="text-muted-foreground text-center text-sm">
            &copy; {new Date().getFullYear()} Intentified, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
