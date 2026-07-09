import Header from "@/components/Header";
import RadarTabela from "@/components/RadarTabela";
import { buscarEmpresas } from "@/lib/api";
import type { Empresa } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function RadarPage() {
  let empresas: Empresa[] = [];
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
          Tabela Comparativa
        </p>

        <div className="mt-4 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">
              Radar Fundamentalista
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Compare empresas brasileiras lado a lado usando preço, múltiplos,
              rentabilidade, dividendos, dívida, liquidez, score e classificação.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm text-slate-300">Empresas na base</p>
            <p className="mt-2 text-5xl font-black text-emerald-300">
              {erro ? "-" : empresas.length}
            </p>
          </div>
        </div>

        {erro ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar a Tabela Radar
            </h2>

            <p className="mt-3 text-slate-300">
              Confirme se a API está funcionando e se o backend está online.
            </p>
          </div>
        ) : (
          <RadarTabela empresas={empresas} />
        )}
      </section>
    </main>
  );
}
