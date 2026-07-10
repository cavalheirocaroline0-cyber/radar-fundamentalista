import Link from "next/link";
import Header from "@/components/Header";
import { buscarRanking } from "@/lib/api";

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

export default async function RankingPage() {
  let ranking: any[] = [];
  let erro = false;

  try {
    ranking = await buscarRanking();
  } catch {
    erro = true;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          Ranking
        </p>

        <h1 className="mt-4 text-4xl font-bold">Ranking fundamentalista</h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Empresas ordenadas por score, rentabilidade, dividendos e qualidade dos indicadores.
        </p>

        {erro ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar o ranking
            </h2>
            <p className="mt-3 text-slate-300">
              Confirme se o backend está rodando em http://localhost:8000.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {ranking.map((empresa: any, index: number) => (
              <div
                key={empresa.ticker}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-xl font-bold text-sky-300">
                      {index + 1}
                    </div>

                    <div>
                      <Link
                        href={`/empresa/${empresa.ticker}`}
                        className="text-3xl font-bold text-sky-300 transition hover:text-sky-100 hover:underline"
                      >
                        {empresa.ticker}
                      </Link>

                      <p className="mt-1 text-slate-300">
                        {empresa.setor || "Setor a classificar"} ·{" "}
                        {empresa.classificacao || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-slate-400">Score</p>
                      <p className="mt-1 text-2xl font-bold text-sky-300">
                        {empresa.score ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">P/L</p>
                      <p className="mt-1 text-xl font-bold">
                        {formatarNumero(empresa.pl)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">ROE</p>
                      <p className="mt-1 text-xl font-bold">
                        {formatarPercentual(empresa.roe)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">DY</p>
                      <p className="mt-1 text-xl font-bold">
                        {formatarPercentual(empresa.dividend_yield)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
