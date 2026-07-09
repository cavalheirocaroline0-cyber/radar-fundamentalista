import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/empresas", label: "Empresas" },
  { href: "/ranking", label: "Ranking" },
  { href: "/macro", label: "Macro" },
  { href: "/beta", label: "Beta" },
  { href: "/feedback", label: "Avaliar" },
];

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
          Radar Fundamentalista
        </Link>

        <nav className="flex flex-wrap gap-3 text-sm text-slate-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
