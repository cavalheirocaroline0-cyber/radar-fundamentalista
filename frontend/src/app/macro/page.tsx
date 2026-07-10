import Header from "@/components/Header";
import { buscarMacro } from "@/lib/api";

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

function formatarValorMacro(valor: number | string | null | undefined, unidade?: string | null) {
  if (valor === null || valor === undefined) return "-";

  const numero = Number(valor);

  if (Number.isNaN(numero)) return "-";

  const unidadeNormalizada = unidade?.toLowerCase() || "";

  if (
    unidadeNormalizada.includes("%") ||
    unidadeNormalizada.includes("percentual")
  ) {
    return `${formatarNumero(numero)}%`;
  }

  if (
    unidadeNormalizada.includes("r$") ||
    unidadeNormalizada.includes("real") ||
    unidadeNormalizada.includes("brl")
  ) {
    return `R$ ${formatarNumero(numero)}`;
  }

  return `${formatarNumero(numero)} ${unidade || ""}`.trim();
}

function formatarData(data: string | null | undefined) {
  if (!data) return "-";

  const partes = data.split("-");

  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default async function MacroPage() {
  let dados: any = {
    indicadores: [],
    ativos: [],
  };

  let erro = false;

  try {
    dados = await buscarMacro();
  } catch {
    erro = true;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          Macro
        </p>

        <h1 className="mt-4 text-4xl font-bold">Indicadores macroeconômicos</h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Juros, inflação, câmbio, criptoativos e metais monitorados pelo Dash Diário.
        </p>

        {erro ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar os indicadores macro
            </h2>
            <p className="mt-3 text-slate-300">
              Confirme se o backend está rodando em http://localhost:8000.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Economia
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Indicadores econômicos
                  </h2>
                </div>

                <p className="text-sm text-slate-400">
                  {dados.indicadores.length} indicadores
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dados.indicadores.map((item: any) => (
                  <div
                    key={item.indicador}
                    className="rounded-3xl border border-white/10 bg-slate-900 p-6"
                  >
                    <p className="text-sm text-slate-400">{item.indicador}</p>

                    <p className="mt-2 text-4xl font-bold">
                      {formatarValorMacro(item.valor, item.unidade)}
                    </p>

                    <p className="mt-3 text-sm text-slate-300">
                      {item.descricao || "Indicador macroeconômico"}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {formatarData(item.data_referencia)}
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {item.fonte || "Fonte não informada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Mercado
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Ativos monitorados
                  </h2>
                </div>

                <p className="text-sm text-slate-400">
                  {dados.ativos.length} ativos
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dados.ativos.map((item: any) => (
                  <div
                    key={item.ativo}
                    className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-6"
                  >
                    <p className="text-sm text-slate-300">{item.ativo}</p>

                    <p className="mt-2 text-4xl font-bold text-sky-300">
                      R$ {formatarNumero(item.preco_brl)}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      USD {formatarNumero(item.preco_usd)}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        Variação 24h: {formatarNumero(item.variacao_24h)}%
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {formatarData(item.data_referencia)}
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {item.fonte || "Fonte não informada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
