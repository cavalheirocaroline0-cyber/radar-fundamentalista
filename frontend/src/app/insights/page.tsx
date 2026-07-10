import Header from "@/components/Header";
import BarChartCard from "@/components/BarChartCard";
import RankingCompacto from "@/components/RankingCompacto";
import { buscarInsights } from "@/lib/api";

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

const autores = [
  {
    nome: "Peter Drucker",
    foco: "Gestão por indicadores",
    ideia:
      "Decisões melhores começam quando a empresa transforma percepção em acompanhamento mensurável.",
  },
  {
    nome: "W. Edwards Deming",
    foco: "Qualidade e melhoria contínua",
    ideia:
      "Acompanhamento constante reduz achismos e ajuda a identificar padrões antes que eles virem problemas.",
  },
  {
    nome: "Thomas Davenport",
    foco: "Competição analítica",
    ideia:
      "Organizações orientadas por dados criam vantagem ao transformar informação em decisão prática.",
  },
  {
    nome: "Marty Cagan",
    foco: "Produto e descoberta",
    ideia:
      "Produtos fortes nascem quando times aprendem com evidências reais, não apenas com opiniões internas.",
  },
  {
    nome: "Eric Ries",
    foco: "Validação e aprendizado",
    ideia:
      "Medir, aprender e ajustar rapidamente é essencial para evoluir um produto com base no uso real.",
  },
];

export default async function InsightsPage() {
  let insights: any = null;
  let erro = false;

  try {
    insights = await buscarInsights();
  } catch {
    erro = true;
  }

  const medias = insights?.medias || {};

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          Insights
        </p>

        <div className="mt-4 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">
              Painel diário de dados
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Uma leitura visual da base do Dash Diário: distribuição das
              empresas, médias dos indicadores, rankings e sinais para análise.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
            <p className="text-sm text-slate-300">Empresas analisadas</p>
            <p className="mt-2 text-5xl font-black text-sky-300">
              {erro ? "-" : medias.total_empresas ?? "-"}
            </p>
          </div>
        </div>

        {erro ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar os insights
            </h2>
            <p className="mt-3 text-slate-300">
              Confirme se a API está online e se a rota /insights está funcionando.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Score médio</p>
                <p className="mt-2 text-3xl font-bold text-sky-300">
                  {formatarNumero(medias.media_score)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">ROE médio</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(medias.media_roe)}%
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">DY médio</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(medias.media_dy)}%
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">P/L médio</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(medias.media_pl)}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">P/VP médio</p>
                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(medias.media_pvp)}
                </p>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <BarChartCard
                titulo="Empresas por classificação"
                descricao="Distribuição da base conforme a leitura atual do Dash Diário."
                dados={insights.por_classificacao}
              />

              <BarChartCard
                titulo="Empresas por setor"
                descricao="Concentração das empresas analisadas por setor."
                dados={insights.por_setor}
              />

              <BarChartCard
                titulo="Distribuição de score"
                descricao="Faixas de score para entender a qualidade geral da base."
                dados={insights.distribuicao_score}
              />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <RankingCompacto
                titulo="Top score"
                descricao="Empresas com maior pontuação na metodologia atual."
                empresas={insights.top_score}
                metrica="score"
              />

              <RankingCompacto
                titulo="Top Dividend Yield"
                descricao="Empresas com maior indicador de proventos."
                empresas={insights.top_dividend_yield}
                metrica="dividend_yield"
              />

              <RankingCompacto
                titulo="Top ROE"
                descricao="Empresas com maior retorno sobre patrimônio."
                empresas={insights.top_roe}
                metrica="roe"
              />
            </section>

            <section className="mt-10 rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-400/15 to-slate-400/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
                Cultura de dados
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Por que acompanhar dados diariamente?
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                O Dash Diário nasce da ideia de que decisões melhores surgem
                quando indicadores são acompanhados com frequência, contexto e
                método. Dados não substituem julgamento, mas reduzem ruído,
                ajudam a comparar alternativas e mostram mudanças antes que elas
                fiquem óbvias.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {autores.map((autor) => (
                  <div
                    key={autor.nome}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
                  >
                    <p className="font-bold text-sky-300">{autor.nome}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {autor.foco}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {autor.ideia}
                    </p>
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
