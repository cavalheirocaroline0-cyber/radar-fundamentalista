import Header from "@/components/Header";
import { buscarEmpresaPorTicker } from "@/lib/api";

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

export default async function EmpresaPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;

  let empresa: any = null;
  let erro = false;

  try {
    empresa = await buscarEmpresaPorTicker(ticker);
  } catch {
    erro = true;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        {erro || !empresa ? (
          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h1 className="text-3xl font-bold text-red-300">
              Empresa não encontrada
            </h1>
            <p className="mt-3 text-slate-300">
              Confirme se o ticker existe na base do Radar.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Empresa
            </p>

            <div className="mt-4 flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-5xl font-bold text-emerald-300">
                  {empresa.ticker}
                </h1>

                <p className="mt-3 text-xl text-slate-300">
                  {empresa.empresa || empresa.ticker}
                </p>

                <p className="mt-2 text-slate-400">
                  {empresa.setor || "Setor a classificar"} ·{" "}
                  {empresa.classificacao || "Sem classificação"}
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                <p className="text-sm text-slate-300">Score Radar</p>
                <p className="mt-2 text-6xl font-bold text-emerald-300">
                  {empresa.score ?? "-"}
                </p>
              </div>
            </div>

            <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Preço</p>
                <p className="mt-2 text-3xl font-bold">
                  R$ {formatarNumero(empresa.preco)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">P/L</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(empresa.pl)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">P/VP</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(empresa.pvp)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Dividend Yield</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarPercentual(empresa.dividend_yield)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">ROE</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarPercentual(empresa.roe)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Margem líquida</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarPercentual(empresa.margem_liquida)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Dívida líquida/EBITDA</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(empresa.divida_liquida_ebitda)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Liquidez 2 meses</p>
                <p className="mt-2 text-3xl font-bold">
                  R$ {formatarNumero(empresa.liquidez_2_meses)}
                </p>
              </div>
            </section>

            <section className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Leitura rápida
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Resumo fundamentalista
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                {empresa.ticker} possui score {empresa.score ?? "-"} no Radar.
                A empresa aparece como{" "}
                <strong>{empresa.classificacao || "sem classificação"}</strong>,
                com P/L de {formatarNumero(empresa.pl)}, P/VP de{" "}
                {formatarNumero(empresa.pvp)}, ROE de{" "}
                {formatarPercentual(empresa.roe)} e dividend yield de{" "}
                {formatarPercentual(empresa.dividend_yield)}.
              </p>

              <p className="mt-4 text-xs text-slate-400">
                Fonte: {empresa.fonte || "não informada"} · Data da coleta:{" "}
                {empresa.data_coleta || "-"}
              </p>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
