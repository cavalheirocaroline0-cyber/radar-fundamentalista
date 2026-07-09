import Header from "@/components/Header";

const ranking = [
  { posicao: 1, ticker: "PETR4", criterio: "Dividendos", score: 88 },
  { posicao: 2, ticker: "VALE3", criterio: "Valor patrimonial", score: 84 },
  { posicao: 3, ticker: "ITUB4", criterio: "ROE", score: 81 },
  { posicao: 4, ticker: "BBAS3", criterio: "P/L atrativo", score: 79 },
];

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Ranking
        </p>
        <h1 className="mt-4 text-4xl font-bold">Ranking fundamentalista</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Empresas ordenadas por score e critérios de qualidade, preço, dívida,
          rentabilidade e dividendos.
        </p>

        <div className="mt-8 grid gap-4">
          {ranking.map((item) => (
            <div key={item.ticker} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">#{item.posicao}</p>
                  <h2 className="mt-1 text-3xl font-bold text-emerald-300">{item.ticker}</h2>
                  <p className="mt-2 text-slate-300">{item.criterio}</p>
                </div>
                <p className="text-4xl font-bold">{item.score}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
