import Header from "@/components/Header";
import EmpresasTabela from "@/components/EmpresasTabela";
import { buscarEmpresas } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EmpresasPage() {
  let empresas: any[] = [];
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          Empresas
        </p>

        <h1 className="mt-4 text-4xl font-bold">Empresas monitoradas</h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Dados reais vindos do Neon por meio da API do Dash Diário.
        </p>

        <div className="mt-6 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
          <p className="text-sm text-slate-300">Total carregado da API</p>
          <p className="mt-2 text-4xl font-bold text-sky-300">
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
          <EmpresasTabela empresas={empresas} />
        )}
      </section>
    </main>
  );
}
