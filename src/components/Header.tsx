import { Bell } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-warm-200 bg-surface/80 px-4 backdrop-blur-md lg:px-6" style={{ paddingTop: "env(safe-area-inset-top, 0px)", height: "calc(4rem + env(safe-area-inset-top, 0px))" }}>
      <span className="text-lg font-semibold tracking-tight text-warm-900">
        Kaitlyn&rsquo;s Kloset
      </span>

      <div className="flex items-center gap-1">
        <button className="relative flex h-11 w-11 items-center justify-center rounded-full text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blush-500" />
        </button>

        <Image
          src="https://picsum.photos/seed/kaitlyn-avatar/80/80"
          alt="Kaitlyn"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-warm-200"
        />
      </div>
    </header>
  );
}
