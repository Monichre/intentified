import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-3 px-4 mt-auto z-10">
      <div className="max-w-md mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
        <div className="mb-2 md:mb-0">© 2025 Company. All rights reserved.</div>
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-white/60 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-white/60 transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-white/60 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
