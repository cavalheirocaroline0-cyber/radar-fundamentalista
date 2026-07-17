export default function IAPage() {
  const sugestoes = [
    "O que significa P/L?",
    "Como interpretar ROE?",
    "O que é Dividend Yield?",
    "Como funciona o score do Dash Diário?",
    "Como a Selic influencia o mercado?",
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-28 pt-8 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Assistente IA
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            🧠 IA do Dash Diário
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
            Tire dúvidas sobre indicadores, rankings, empresas, mercado e
            análise fundamentalista de forma simples e educativa.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            A IA do Dash Diário tem finalidade educativa e informativa. Ela não
            realiza recomendação de investimento, consultoria financeira ou
            indicação de compra e venda de ativos.
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <label
            htmlFor="pergunta"
            className="text-sm font-semibold text-slate-200"
          >
            Faça uma pergunta
          </label>

          <textarea
            id="pergunta"
            rows={5}
            placeholder="Exemplo: o que significa P/L baixo?"
            className="mt-3 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400"
          />

          <button
            type="button"
            className="mt-4 w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
          >
            Perguntar à IA
          </button>

          <p className="mt-3 text-xs text-slate-500">
            Em breve esta área será conectada à assistente real do Dash Diário.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">
            Perguntas rápidas
          </h2>

          <div className="mt-4 grid gap-3">
            {sugestoes.map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-sky-400 hover:text-slate-100"
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
