import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutGrid,
  Palette,
  BookOpen,
  Home,
  Users,
  Briefcase,
  Mail,
  Compass,
  CreditCard,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

type MenuItem = {
  icon: React.ReactNode;
  label: string;
};

type SubMenuItem = {
  icon: React.ReactNode;
  title: string;
};

type MenuItemContent = {
  items: SubMenuItem[];
};

const menuItems: MenuItem[] = [
  {
    icon: <LayoutGrid className="h-5 w-5" />,
    label: "Dashboard",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    label: "Resources",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: "Account",
  },
];

const menuItemsContent: MenuItemContent[] = [
  {
    items: [
      {
        title: "Home",
        icon: <Home size={18} />,
      },
      {
        title: "Our Team",
        icon: <Users size={18} />,
      },
    ],
  },
  {
    items: [
      {
        title: "Services",
        icon: <Briefcase size={18} />,
      },
      {
        title: "Contact",
        icon: <Mail size={18} />,
      },
      {
        title: "Explore",
        icon: <Compass size={18} />,
      },
      {
        title: "Pricing",
        icon: <CreditCard size={18} />,
      },
    ],
  },
  {
    items: [
      {
        title: "Settings",
        icon: <Settings size={18} />,
      },
      {
        title: "Profile",
        icon: <UserCircle size={18} />,
      },
      {
        title: "Logout",
        icon: <LogOut size={18} />,
      },
    ],
  },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.relatedTarget as Node)
    ) {
      setActiveIndex(null);
    }
  };

  return (
    <main className="relative flex h-screen w-full items-start justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-10 md:items-center">
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <motion.div className="absolute bottom-[36%] left-1/2 z-[2] flex w-[480px] -translate-x-1/2 items-center justify-between gap-2 bg-transparent">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              className="relative flex items-center justify-center gap-2 px-6 py-3 text-zinc-300 transition-colors duration-300 hover:text-zinc-100"
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <div className="relative z-[2] flex items-center justify-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {activeIndex === index && (
                <motion.div
                  className="absolute inset-0 size-full border border-zinc-800 bg-zinc-800/50"
                  layoutId="indicator"
                  style={{
                    borderRadius: 12,
                  }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
        <div className="absolute bottom-[34.5%] left-1/2 -translate-x-1/2">
          <motion.div
            ref={menuRef}
            className="overflow-hidden border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl"
            style={{
              borderRadius: 20,
            }}
            animate={{
              width: 500,
              height: activeIndex !== null ? [162, 250, 206][activeIndex] : 64,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatePresence initial={false}>
              {activeIndex !== null && (
                <motion.div
                  key={activeIndex}
                  className="absolute bottom-16 flex w-full items-end justify-start pb-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {menuItemsContent.map((items, index) => (
                    <div
                      className="w-full shrink-0 px-2"
                      key={index}
                      style={{
                        transform: `translateX(${activeIndex * -100}%)`,
                      }}
                    >
                      {items.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="group flex w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-zinc-400 duration-300 hover:bg-zinc-800/50 hover:text-zinc-100"
                        >
                          <div className="text-zinc-500 group-hover:text-zinc-400">
                            {item.icon}
                          </div>
                          <p className="text-sm font-medium transition-[padding] duration-300 group-hover:pl-2">
                            {item.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
