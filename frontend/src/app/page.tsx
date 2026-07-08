const indicadoresMacro = [
  { nome: "Selic", valor: "15,00%", detalhe: "Taxa básica de juros" },
  { nome: "IPCA", valor: "4,23%", detalhe: "Inflação acumulada" },
  { nome: "Dólar", valor: "R$ 5,45", detalhe: "Câmbio comercial" },
  { nome: "Bitcoin", valor: "R$ 580 mil", detalhe: "Criptoativo monitorado" },
  { nome: "Ouro", valor: "R$ 620", detalhe: "Grama em reais" },
  { nome: "Prata", valor: "R$ 6,80", detalhe: "Grama em reais" },
];

const rankings = [
  { ticker: "PETR4", nome: "Petrobras", score: 88, indicador: "Dividendos" },
  { ticker: "VALE3", nome: "Vale", score: 84, indicador: "Valor patrimonial" },
  { ticker: "ITUB4", nome: "Itaú Unibanco", score: 81, indicador: "ROE" },
  { ticker: "BBAS3", nome: "Banco do Brasil", score: 79, indicador: "P/L atrativo" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Radar Fundamentalista
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
              Plataforma de análise fundamentalista
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
              Acompanhe empresas brasileiras, indicadores micro e macro, rankings,
              filtros inteligentes e oportunidades de mercado em uma visão simples.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5">
            <p className="text-sm text-slate-300">Empresas monitoradas</p>
            <p className="mt-2 text-5xl font-bold text-emerald-300">50</p>
            <p className="mt-2 text-sm text-slate-400">Atualização automatizada</p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Status do produto</p>
            <h2 className="mt-2 text-2xl font-semibold">MVP em evolução</h2>
            <p className="mt-3 text-sm text-slate-300">
              Dashboard, banco Neon, coletas automáticas e indicadores já estruturados.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Próximo salto</p>
            <h2 className="mt-2 text-2xl font-semibold">Site + App mobile</h2>
            <p className="mt-3 text-sm text-slate-300">
              Interface própria, responsiva e pronta para virar PWA no celular.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Diferencial futuro</p>
            <h2 className="mt-2 text-2xl font-semibold">IA de análise</h2>
            <p className="mt-3 text-sm text-slate-300">
              Explicações simples sobre empresas, riscos, indicadores e comparações.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Mercado
              </p>
              <h2 className="mt-2 text-3xl font-bold">Indicadores macro</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {indicadoresMacro.map((item) => (
              <div
                key={item.nome}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{item.nome}</p>
                <p className="mt-2 text-3xl font-bold">{item.valor}</p>
                <p className="mt-2 text-sm text-slate-400">{item.detalhe}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Ranking
              </p>
              <h2 className="mt-2 text-3xl font-bold">Empresas em destaque</h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Ticker</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Destaque</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((empresa) => (
                    <tr key={empresa.ticker} className="border-t border-white/10">
                      <td className="px-4 py-4 font-bold text-emerald-300">
                        {empresa.ticker}
                      </td>
                      <td className="px-4 py-4">{empresa.nome}</td>
                      <td className="px-4 py-4">{empresa.score}</td>
                      <td className="px-4 py-4 text-slate-300">
                        {empresa.indicador}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Visão do produto
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Do dashboard para uma plataforma real
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              A próxima etapa é conectar esta interface ao Neon, criar páginas
              individuais por empresa, ranking filtrável, área macro e versão
              instalável no celular.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p>✓ Site responsivo</p>
              <p>✓ Base para app mobile</p>
              <p>✓ Integração futura com banco de dados</p>
              <p>✓ Preparado para IA e alertas</p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
