import Header from "@/components/Header";

const empresas = [
  { ticker: "PETR4", nome: "Petrobras", setor: "Petróleo e Gás", score: 88 },
  { ticker: "VALE3", nome: "Vale", setor: "Mineração", score: 84 },
  { ticker: "ITUB4", nome: "Itaú Unibanco", setor: "Bancos", score: 81 },
  { ticker: "BBAS3", nome: "Banco do Brasil", setor: "Bancos", score: 79 },
  { ticker: "WEGE3", nome: "Weg", setor: "Indústria", score: 76 },
];

export default function EmpresasPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Empresas
        </p>
        <h1 className="mt-4 text-4xl font-bold">Empresas monitoradas</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Lista inicial das empresas acompanhadas pelo Radar Fundamentalista.
          Depois essa tabela será conectada diretamente ao banco Neon.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/10 text-slate-300">
              <tr>
                <th className="px-4 py-3">Ticker</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Setor</th>
                <th className="px-4 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.ticker} className="border-t border-white/10">
                  <td className="px-4 py-4 font-bold text-emerald-300">{empresa.ticker}</td>
                  <td className="px-4 py-4">{empresa.nome}</td>
                  <td className="px-4 py-4 text-slate-300">{empresa.setor}</td>
                  <td className="px-4 py-4">{empresa.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
