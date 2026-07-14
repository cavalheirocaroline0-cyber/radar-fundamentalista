import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="text-lg font-black text-white">Dash Diário</p>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              Dados, indicadores e informações organizadas para ajudar você a
              acompanhar o mercado e tomar decisões mais conscientes.
            </p>

            <p className="mt-4 text-sm font-semibold text-sky-300">
              Todo dia começa com o Dash.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Institucional
            </p>

            <nav className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/sobre" className="transition hover:text-sky-300">
                Sobre
              </Link>

              <Link href="/contato" className="transition hover:text-sky-300">
                Contato
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Legal
            </p>

            <nav className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                href="/politica-de-privacidade"
                className="transition hover:text-sky-300"
              >
                Política de Privacidade
              </Link>

              <Link
                href="/termos-de-uso"
                className="transition hover:text-sky-300"
              >
                Termos de Uso
              </Link>

              <Link
                href="/aviso-legal"
                className="transition hover:text-sky-300"
              >
                Aviso Legal
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs leading-5 text-slate-500">
            O Dash Diário possui finalidade exclusivamente educacional e
            informativa. O conteúdo disponibilizado não constitui recomendação
            personalizada de compra, venda ou manutenção de ativos.
          </p>

          <p className="mt-4 text-xs text-slate-600">
            © {new Date().getFullYear()} Dash Diário. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
