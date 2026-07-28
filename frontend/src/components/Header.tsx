"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const desktopLinks = [
  { href: "/", label: "Início" },
  { href: "/empresas", label: "Empresas" },
  { href: "/ranking", label: "Ranking" },
];

export default function Header() {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const verificarLogin = () => {
      const token = localStorage.getItem("dash_token");
      setLogado(Boolean(token));
    };

    verificarLogin();
    window.addEventListener("storage", verificarLogin);

    return () => {
      window.removeEventListener("storage", verificarLogin);
    };
  }, []);

  return (
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#020817]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/dash-icon-navbar.png"
              alt="Ícone do Dash Diário"
              width={44}
              height={44}
              priority
              className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-[0_0_15px_rgba(14,165,233,0.35)] sm:h-11 sm:w-11"
            />

            <div className="min-w-0">
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
  );
}
