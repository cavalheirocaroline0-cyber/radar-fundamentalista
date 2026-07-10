import Link from "next/link";
import Header from "@/components/Header";
import { buscarRanking } from "@/lib/api";
import type { Empresa } from "@/lib/api";

export const dynamic = "force-dynamic";

function numero(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined) return null;

  const convertido = Number(valor);

  if (Number.isNaN(convertido)) return null;

  return convertido;
}

function formatarNumero(valor: number | string | null | undefined) {
  const n = numero(valor);

  if (n === null) return "-";

  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarPercentual(valor: number | string | null | undefined) {
  const n = numero(valor);

  if (n === null) return "-";

  return `${formatarNumero(n)}%`;
}

function formatarDinheiro(valor: number | string | null | undefined) {
  const n = numero(valor);

  if (n === null) return "-";

  return `R$ ${n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function descricaoScore(score: number | string | null | undefined) {
  const s = numero(score);

  if (s === null) return "Sem leitura suficiente";
  if (s >= 80) return "Destaque forte";
  if (s >= 65) return "Boa posição";
  if (s >= 50) return "Zona intermediária";
  return "Requer atenção";
}

function melhorPorCampo(empresas: Empresa[], campo: keyof Empresa) {
  return [...empresas].sort((a, b) => {
    const valorA = numero(a[campo]);
    const valorB = numero(b[campo]);

    if (valorA === null && valorB === null) return 0;
    if (valorA === null) return 1;
    if (valorB === null) return -1;

    return valorB - valorA;
  })[0];
}

export default async function RankingPage() {
  let ranking: Empresa[] = [];
  let erro = false;

  try {
    ranking = await buscarRanking();
  } catch {
    erro = true;
  }

  const podium = ranking.slice(0, 3);
  const maiorScore = ranking[0];
  const maiorDY = melhorPorCampo(ranking, "dividend_yield");
  const maiorROE = melhorPorCampo(ranking, "roe");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          Ranking
        </p>

        <div className="mt-4 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">
              Ranking do Dash Diário
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              O ranking organiza as empresas da base por score, combinando
              indicadores como rentabilidade, dividendos, valuation, liquidez e
              qualidade dos dados disponíveis. Ele ajuda a priorizar análise,
              mas não representa recomendação de compra ou venda.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
            <p className="text-sm text-slate-300">Empresas no ranking</p>
            <p className="mt-2 text-5xl font-black text-sky-300">
              {erro ? "-" : ranking.length}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Ordenadas pela metodologia atual
            </p>
          </div>
        </div>

        {erro ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar o ranking
            </h2>
            <p className="mt-3 text-slate-300">
              Confirme se a API está funcionando e se o backend está online.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 lg:grid-cols-3">
              {podium.map((empresa, index) => (
                <Link
                  key={empresa.ticker}
                  href={`/empresa/${empresa.ticker}`}
                  className="group rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-400/15 to-slate-400/5 p-6 transition hover:border-sky-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                        Top {index + 1}
                      </p>

                      <h2 className="mt-3 text-4xl font-black text-white group-hover:text-sky-300">
                        {empresa.ticker}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {empresa.setor || "Setor a classificar"} ·{" "}
                        {empresa.classificacao || "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-center">
                      <p className="text-xs text-slate-400">Score</p>
                      <p className="text-3xl font-black text-sky-300">
                        {empresa.score ?? "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                      <p className="text-slate-500">ROE</p>
                      <p className="mt-1 font-bold">
                        {formatarPercentual(empresa.roe)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                      <p className="text-slate-500">DY</p>
                      <p className="mt-1 font-bold">
                        {formatarPercentual(empresa.dividend_yield)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                      <p className="text-slate-500">P/L</p>
                      <p className="mt-1 font-bold">
                        {formatarNumero(empresa.pl)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Maior score</p>
                <p className="mt-2 text-2xl font-bold text-sky-300">
                  {maiorScore?.ticker || "-"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Score {maiorScore?.score ?? "-"} ·{" "}
                  {descricaoScore(maiorScore?.score)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Maior Dividend Yield</p>
                <p className="mt-2 text-2xl font-bold text-sky-300">
                  {maiorDY?.ticker || "-"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {formatarPercentual(maiorDY?.dividend_yield)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Maior ROE</p>
                <p className="mt-2 text-2xl font-bold text-sky-300">
                  {maiorROE?.ticker || "-"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {formatarPercentual(maiorROE?.roe)}
                </p>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Tabela do ranking</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    A tabela abaixo mostra os principais indicadores das empresas
                    ordenadas pelo score. Colunas numéricas ficam alinhadas à
                    direita para facilitar comparação visual.
                  </p>
                </div>

                <Link
                  href="/dash"
                  className="rounded-full border border-sky-400/30 px-5 py-3 text-sm font-bold text-sky-300 transition hover:bg-sky-400/10"
                >
                  Comparar no Dash →
                </Link>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[1150px] text-left text-sm">
                  <thead className="bg-slate-900 text-slate-300">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Ticker</th>
                      <th className="px-4 py-3 text-left">Setor</th>
                      <th className="px-4 py-3 text-left">Classificação</th>
                      <th className="px-4 py-3 text-right">Preço</th>
                      <th className="px-4 py-3 text-right">P/L</th>
                      <th className="px-4 py-3 text-right">P/VP</th>
                      <th className="px-4 py-3 text-right">ROE</th>
                      <th className="px-4 py-3 text-right">DY</th>
                      <th className="px-4 py-3 text-right">Score</th>
                      <th className="px-4 py-3 text-left">Leitura</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ranking.map((empresa, index) => (
                      <tr
                        key={empresa.ticker}
                        className="border-t border-white/10 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-4 py-4 text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4 font-bold text-sky-300">
                          <Link
                            href={`/empresa/${empresa.ticker}`}
                            className="hover:underline"
                          >
                            {empresa.ticker}
                          </Link>
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {empresa.setor || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                            {empresa.classificacao || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          {formatarDinheiro(empresa.preco)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          {formatarNumero(empresa.pl)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          {formatarNumero(empresa.pvp)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          {formatarPercentual(empresa.roe)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          {formatarPercentual(empresa.dividend_yield)}
                        </td>

                        <td className="px-4 py-4 text-right font-black text-sky-300">
                          {empresa.score ?? "-"}
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {descricaoScore(empresa.score)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Como interpretar este ranking?</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="font-bold text-sky-300">Score</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Resume a leitura dos indicadores disponíveis. Quanto maior,
                    mais a empresa se destaca dentro da metodologia atual.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="font-bold text-sky-300">Classificação</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Traduz o score e os indicadores em uma leitura simples, como
                    Forte, Neutra, Atenção ou Oportunidade.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="font-bold text-sky-300">Comparação</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    O ranking serve para priorizar análise. A decisão deve
                    considerar setor, risco, preço, histórico e objetivo do
                    investidor.
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Este ranking é educacional e automatizado. Ele não representa
                recomendação de compra, venda ou manutenção de ativos.
              </p>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
