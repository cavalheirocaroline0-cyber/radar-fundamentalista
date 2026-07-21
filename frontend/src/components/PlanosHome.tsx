import Link from "next/link";

export default function PlanosHome() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
          Escolha seu plano
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Comece grátis. Ative a IA quando quiser.
        </h2>

        <p className="mt-3 text-base leading-7 text-slate-300">
          O Dash Diário organiza mercado, empresas, ranking e indicadores em poucos minutos.
          O plano Premium libera a IA para explicar tudo em linguagem simples.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
                Plano atual
              </p>

              <h3 className="mt-3 text-3xl font-black text-white">
                Gratuito
              </h3>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-300">
              sem IA
            </span>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-300">
            Para acompanhar o mercado com dados organizados e criar o hábito diário.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>✅ Home com resumo diário</p>
            <p>✅ Empresas monitoradas</p>
            <p>✅ Ranking fundamentalista</p>
            <p>✅ Indicadores macro</p>
            <p>✅ Perfil e watchlist</p>
            <p className="text-slate-500">🚫 IA do Dash não incluída</p>
          </div>

          <Link
            href="/cadastro"
            className="mt-8 inline-flex w-full justify-center rounded-full border border-white/20 px-6 py-4 text-center font-black text-white transition hover:border-sky-400 hover:text-sky-300"
          >
            Continuar grátis
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-sky-400/30 bg-sky-400/10 p-6 shadow-2xl shadow-sky-950/30">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-300/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-sky-300">
                  Plano premium
                </p>

                <h3 className="mt-3 text-3xl font-black text-white">
                  Dash com IA
                </h3>
              </div>

              <span className="rounded-full bg-sky-400 px-4 py-2 text-xs font-black text-slate-950">
                recomendado
              </span>
            </div>

            <div className="mt-5 rounded-3xl border border-sky-400/20 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">
                Primeira semana
              </p>

              <p className="mt-1 text-4xl font-black text-white">
                grátis
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Depois, apenas <strong className="text-sky-200">R$ 4,90 por semana</strong>.
                Cancele quando quiser.
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <p>✅ Todos os recursos do plano gratuito</p>
              <p>✅ IA para explicar indicadores</p>
              <p>✅ Perguntas sobre empresas, ranking e mercado</p>
              <p>✅ Leitura simples para criar rotina diária</p>
              <p>✅ Desenvolva hábitos de qualidade com dados</p>
            </div>

            <Link
              href="/checkout?plano=premium"
              className="mt-8 inline-flex w-full justify-center rounded-full bg-sky-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-sky-300"
            >
              Começar 7 dias grátis
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              A cobrança começa somente após a primeira semana gratuita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
