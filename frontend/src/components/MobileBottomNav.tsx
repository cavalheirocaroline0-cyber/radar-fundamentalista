"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: "🏠",
  },
  {
    label: "Mercado",
    href: "/macro",
    icon: "📈",
  },
  {
    label: "Empresas",
    href: "/empresas",
    icon: "🔍",
  },
  {
    label: "Ranking",
    href: "/ranking",
    icon: "🏆",
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: "👤",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 px-2 pb-3 pt-2 shadow-2xl shadow-black/40 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs transition ${
                active
                  ? "bg-sky-400 text-slate-950"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
