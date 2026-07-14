"use client";

import Link from "next/link";

const navItems = [
  { name: "Explore", href: "/explore" },
  { name: "Magazine", href: "/magazine" },
  { name: "Brands", href: "/brands" },
  { name: "Collections", href: "/collections" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-[0.35em] text-white"
        >
          QRABES
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-zinc-400 transition duration-300 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="hidden lg:flex items-center w-[360px] rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">

          <span className="text-zinc-500 text-lg">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search luxury stories..."
            className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-zinc-800"
            aria-label="Notifications"
          >
            🔔
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-zinc-800"
            aria-label="Profile"
          >
            👤
          </button>

          {/* Mobile Menu */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-zinc-800 lg:hidden"
            aria-label="Menu"
          >
            ☰
          </button>

        </div>

      </div>

    </header>
  );
}
