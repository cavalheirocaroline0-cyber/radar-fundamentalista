import Link from "next/link";

export default function IAPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-28 pt-8 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-sky-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Recurso Premium
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            🧠 IA do Dash Diário
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
            Uma assistente educativa para explicar indicadores, rankings,
            empresas e contexto de mercado de forma simples, clara e
            informativa.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
            A IA do Dash Diário não realiza recomendação de investimento,
            consultoria financeira ou indicação de compra e venda de ativos. O
            foco é educação, interpretação de dados e apoio ao estudo do
            mercado.
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-sky-400/30 bg-slate-900 p-6 shadow-xl shadow-sky-950/30">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Oferta inicial
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Assine o Dash Diário Premium
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                Tenha acesso à Assistente IA do Dash Diário para entender
                indicadores, rankings e conceitos de mercado com mais clareza no
                seu dia a dia.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-5 text-center">
              <p className="text-sm text-slate-400">Plano inicial</p>

              <div className="mt-2 flex items-end justify-center gap-1">
                <span className="text-2xl font-bold text-slate-100">R$</span>
                <span className="text-5xl font-extrabold text-sky-300">
                  19,90
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-400">por mês</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-300">
                ✅ Explicações sobre P/L, P/VP, ROE e Dividend Yield
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-300">
                ✅ Interpretação educativa dos rankings do Dash Diário
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-300">
                ✅ Apoio para entender Selic, IPCA, dólar e cenário de mercado
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-300">
                ✅ Experiência premium dentro do app Dash Diário
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="https://www.asaas.com/c/8u7kbl" target="_blank" rel="noopener noreferrer"
              className="rounded-2xl bg-sky-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-sky-300"
            >
              Assinar por R$ 19,90/mês
            </Link>

            <Link
              href="/feedback"
              className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-sky-400"
            >
              Enviar sugestão
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            A assinatura ainda está em fase de validação. Ao entrar na lista,
            você será avisado quando o acesso premium estiver disponível.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-semibold">O que a IA vai fazer?</h3>
            <p className="mt-2 text-sm text-slate-400">
              Explicar indicadores, conceitos financeiros, rankings, score e
              contexto macroeconômico em linguagem simples.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-semibold">O que a IA não vai fazer?</h3>
            <p className="mt-2 text-sm text-slate-400">
              Ela não vai dizer onde investir, não vai montar carteira e não vai
              recomendar compra ou venda de ativos.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
