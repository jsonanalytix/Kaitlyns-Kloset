"use client";

import { Home, Shirt, Sparkles, MapPin, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wardrobe", label: "Wardrobe", icon: Shirt },
  { href: "/stylist", label: "Stylist", icon: Sparkles },
  { href: "/trips", label: "Trips", icon: MapPin },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-warm-200 bg-surface lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-warm-200 px-5">
        <span className="text-lg font-semibold tracking-tight text-warm-900">
          Kaitlyn&rsquo;s Kloset
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blush-50 text-blush-500"
                  : "text-warm-500 hover:bg-warm-100 hover:text-warm-700"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
