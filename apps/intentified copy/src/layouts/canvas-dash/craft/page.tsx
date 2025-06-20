import Clock from "@/components/clock";
import CraftCard from "@/components/craft-card";
import Footer from "@/components/footer";
import Link from "next/link";

interface CraftItem {
  title: string;
  description: string;
  href: string;
}

export default function Craft() {
  const craftItems: CraftItem[] = [
    {
      title: "Animated Tabs",
      description: "Elevate your navigation with fluid, eye-catching transitions",
      href: "/craft/animated-tabs",
    },
    {
      title: "Command Menu",
      description: "Boost productivity with lightning-fast keyboard navigation",
      href: "/craft/command-menu",
    },
    {
      title: "Animated Transfer Menu",
      description: "Simplify money transfers with an engaging, intuitive interface",
      href: "/craft/animated-transfer-menu",
    },
    {
      title: "Flight Ticket",
      description: "Reimagine travel with an interactive, sleek boarding pass",
      href: "/craft/flight-ticket",
    },
    {
      title: "Mobile Checkout Menu",
      description: "Streamline purchases with a smooth, mobile-first design",
      href: "/craft/mobile-checkout",
    },
    {
      title: "Nothing OS",
      description: "Experience zen-like focus with a minimalist OS interface",
      href: "/craft/nothing-os",
    },
    {
      title: "Dot Matrix",
      description: "Relive the nostalgia of retro printing in digital form",
      href: "/craft/dot-matrix",
    },
    {
      title: "Gooey Menu",
      description: "A gooey search bar.",
      href: "/craft/gooey-menu",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center py-10 w-full text-sm font-mono text-neutral-600 h-24 animate-entry">
        <Link href="/" className="flex items-center space-x-1 text-xs font-semibold text-neutral-500 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="group-hover:text-neutral-400 transition-colors">Back</span>
        </Link>
        <div>
          <div style={{ opacity: 1, filter: "blur(0px)", transform: "none" }}>
            <Clock />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-full animate-entry delay-100">
        <p className="text-lg font-semibold text-zinc-300 font-geistSans">Craft</p>
        <p className="text-xs font-semibold text-neutral-500 font-geistMono">Experience unique and interactive designs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pt-16 pb-4 animate-entry delay-200">
        {craftItems.map((item, index) => (
          <CraftCard
            key={index}
            title={item.title}
            description={item.description}
            href={item.href}
          />
        ))}
      </div>

      <div className="animate-entry delay-300">
        <Footer />
      </div>
    </>
  );
}
