"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const desktopLinks = [
  { href: "/", label: "Início" },
  { href: "/empresas", label: "Empresas" },
  { href: "/ranking", label: "Ranking" },
];

const mobileLinks = [
  { href: "/", label: "Home", icon: "☀️" },
  { href: "/empresas", label: "Empresas", icon: "🏢" },
  { href: "/perfil", label: "Carteira", icon: "⭐" },
  { href: "/insights", label: "IA", icon: "🤖" },
  { href: "/perfil", label: "Perfil", icon: "👤" },
];

export default function Header() {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("dash_token");
    setLogado(Boolean(token));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-base font-black text-sky-300 md:flex">
              D
            </div>

            <div>
              <div className="flex items-end gap-2 leading-none">
                <span className="text-2xl font-black tracking-tight text-sky-300">
                  Dash
                </span>
                <span className="pb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Diário
                </span>
              </div>

              <p className="mt-1 hidden text-xs text-slate-500 md:block">
                Dados, empresas e mercado em uma visão simples
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 text-sm text-slate-300 md:flex">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-300"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={logado ? "/perfil" : "/entrar"}
              className="rounded-full bg-sky-400 px-5 py-2 font-bold text-slate-950 transition hover:bg-sky-300"
            >
              {logado ? "Perfil" : "Entrar"}
            </Link>
          </nav>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-3 py-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-semibold text-slate-400 transition hover:bg-sky-400/10 hover:text-sky-300"
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span className="mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
