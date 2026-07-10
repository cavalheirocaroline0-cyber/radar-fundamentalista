import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/empresas", label: "Empresas" },
  { href: "/dash", label: "Dash" },
  { href: "/ranking", label: "Ranking" },
  { href: "/macro", label: "Macro" },
  { href: "/insights", label: "Insights" },
  { href: "/beta", label: "Beta" },
  { href: "/feedback", label: "Avaliar" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-base font-black text-sky-300">
            D
          </div>

          <div>
            <div className="flex items-end gap-2 leading-none">
              <span className="text-3xl font-black tracking-tight text-sky-300">
                Dash
              </span>
              <span className="pb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Diário
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Dados, empresas e mercado em uma visão simples
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap gap-3 text-sm text-slate-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
