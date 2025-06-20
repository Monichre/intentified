import Card from "@/components/card";
import Clock from "@/components/clock";
import Footer from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Header with location and time */}
      <div className="flex justify-between items-center py-10 w-full text-sm font-mono text-neutral-600 animate-entry">
        <p>Netherlands</p>
        <div>
          <div style={{ opacity: 1, filter: "blur(0px)", transform: "none" }}>
            <Clock />
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="flex flex-col w-full h-full animate-entry delay-100">
        <p className="text-lg font-semibold text-zinc-300 font-geistSans">Rick Huijser</p>
        <p className="text-xs font-semibold text-neutral-500 font-geistMono">Fullstack Developer</p>
        <div className="w-auto text-zinc-200 text-base font-geistSans py-6">
          <span>
            Just your friendly neighborhood fullstack developer{" "}
            <span className="italic font-serif">crafting delightful digital experiences</span>.
            When I'm not busy <span className="font-serif italic underline">coding</span> or{" "}
            <div className="relative inline-block">
              <span className="italic font-serif underline">designing</span>
            </div>
            , you can find me perfecting my coffee brewing skills or arguing with my cat about the best way to use a mouse.
            Currently freelancing and making <span>magic</span> happen one project at a time!
          </span>
        </div>
      </div>

      {/* Work and Projects Section */}
      <div className="flex flex-col sm:flex-row sm:space-x-12 py-4 animate-entry delay-200">
        {/* My Work */}
        <div className="flex flex-col py-6">
          <p className="text-xs font-semibold text-neutral-500 font-geistMono pb-2">My Work</p>
          <div className="grid grid-cols-1 mt-2 h-auto gap-12">
            <Card
              title="Dextop Models"
              year="2024"
              month="11"
              description="A Company that creates high quality metal cnc'd chessboards and pieces. I worked on the marketing, website and dashboard."
              extendedDescription="Dextop Models is a company that creates high quality metal cnc'd chessboards and pieces. I worked on the marketing, website and dashboard. I used Next.js, TailwindCSS, Framer Motion, and stripe to create the website and the payment system."
            />
          </div>
          <Link href="/work" className="w-full mt-4 group">
            <p className="text-xs font-semibold text-neutral-500 font-geistMono w-fit group-hover:text-neutral-400 transition-colors relative">
              View all
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-neutral-500 group-hover:w-full transition-all duration-300 group-hover:bg-neutral-400"></span>
            </p>
          </Link>
        </div>

        {/* My Projects */}
        <div className="flex flex-col py-6">
          <p className="text-xs font-semibold text-neutral-500 font-geistMono ml-auto w-fit pb-3">My Projects</p>
          <div className="grid grid-cols-1 mt-2 h-auto gap-12">
            <Card
              title="Threads Remake"
              year="2024"
              month="09"
              description="A remake of the popular social media app Threads."
              extendedDescription="Threads Remake is a clone of the popular social media app Threads. I created this to practice my skills in full-stack development. It features a responsive interface, user authentication, and real-time updates. Built with Next.js, TypeScript, Tailwind CSS, and a backend utilizing GraphQL for efficient data fetching."
            />
            <Card
              title="Livestreaming platform"
              year="2024"
              month="06"
              description="A game livestreaming platform that allows users to stream their games and interact with their viewers."
              extendedDescription="This livestreaming platform allows gamers to stream their gameplay and interact with viewers in real-time. It includes features like chat, subscriptions, and notifications. I implemented the real-time video processing using WebRTC, built a custom chat system with Socket.io, and integrated payment processing for subscriptions and donations."
            />
          </div>
          <Link href="/projects" className="w-full mt-4 group">
            <p className="text-xs font-semibold text-neutral-500 font-geistMono ml-auto w-fit group-hover:text-neutral-400 transition-colors relative">
              View all
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-neutral-500 group-hover:w-full transition-all duration-300 group-hover:bg-neutral-400"></span>
            </p>
          </Link>
        </div>
      </div>

      {/* History Section */}
      <div className="flex flex-col py-4 animate-entry delay-300">
        <p className="text-xs font-semibold text-neutral-500 font-geistMono mb-3">My Future and Past</p>
        <div className="w-auto text-zinc-200 text-base font-geistSans">
          <span>
            With nearly a decade of coding experience, I've built a strong skillset in both backend and frontend development.
            I started freelancing as a kid, which helped me tackle diverse projects and grow my expertise.
            <br /><br />
            For the past four years, I've worked at{" "}
            <div className="relative inline-block">
              <span className="underline italic font-serif">Nijdeken</span>
            </div>
            {" "}and recently joined{" "}
            <div className="relative inline-block">
              <span className="underline italic font-serif">Dextop Models</span>
            </div>
            . As an 18-year-old student, I'm also starting my own company as a fun side project.
            <br /><br />
            Currently, I'm working with a powerful coding{" "}
            <div className="relative inline-block">
              <span className="underline italic font-serif">Stack</span>
            </div>
            {" "}that helps me solve complex problems. I'm excited to explore new technologies and embrace the endless possibilities ahead!
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="animate-entry delay-400">
        <Footer />
      </div>
    </>
  );
}
