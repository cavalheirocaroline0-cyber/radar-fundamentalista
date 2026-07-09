import Header from "@/components/Header";
import { buscarEmpresas } from "@/lib/api";

export const dynamic = "force-dynamic";

function formatarNumero(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined) return "-";

  const numero = Number(valor);

  if (Number.isNaN(numero)) return "-";

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarPercentual(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined) return "-";
  return `${formatarNumero(valor)}%`;
}

export default async function EmpresasPage() {
  let empresas = [];
  let erro = false;

  try {
    empresas = await buscarEmpresas();
  } catch {
    erro = true;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Empresas
        </p>

        <h1 className="mt-4 text-4xl font-bold">Empresas monitoradas</h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Dados reais vindos do Neon por meio da API do Radar Fundamentalista.
        </p>

        <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-sm text-slate-300">Total carregado da API</p>
          <p className="mt-2 text-4xl font-bold text-emerald-300">
            {erro ? "Erro" : empresas.length}
          </p>
        </div>

        {erro ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar as empresas
            </h2>
            <p className="mt-3 text-slate-300">
              Confirme se o backend está rodando em http://localhost:8000.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-white/10 text-slate-300">
                <tr>
                  <th className="px-4 py-3">Ticker</th>
                  <th className="px-4 py-3">Setor</th>
                  <th className="px-4 py-3">Classificação</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">P/L</th>
                  <th className="px-4 py-3">P/VP</th>
                  <th className="px-4 py-3">ROE</th>
                  <th className="px-4 py-3">DY</th>
                  <th className="px-4 py-3">Score</th>
                </tr>
              </thead>

              <tbody>
                {empresas.map((empresa: any) => (
                  <tr key={empresa.ticker} className="border-t border-white/10">
                    <td className="px-4 py-4 font-bold text-emerald-300">
                      {empresa.ticker}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {empresa.setor || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                        {empresa.classificacao || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      R$ {formatarNumero(empresa.preco)}
                    </td>
                    <td className="px-4 py-4">{formatarNumero(empresa.pl)}</td>
                    <td className="px-4 py-4">{formatarNumero(empresa.pvp)}</td>
                    <td className="px-4 py-4">
                      {formatarPercentual(empresa.roe)}
                    </td>
                    <td className="px-4 py-4">
                      {formatarPercentual(empresa.dividend_yield)}
                    </td>
                    <td className="px-4 py-4 font-bold text-emerald-300">
                      {empresa.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
