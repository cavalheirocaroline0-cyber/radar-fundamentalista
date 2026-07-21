import Link from "next/link";
import Header from "@/components/Header";
import HomeHero from "@/components/HomeHero";
import PlanosHome from "@/components/PlanosHome";
import SaudacaoHome from "@/components/SaudacaoHome";
import { buscarEmpresas, buscarMacro, buscarRanking, buscarEmpresasDoDia } from "@/lib/api";

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

  if (unidadeNormalizada.includes("%") || unidadeNormalizada.includes("percentual")) {
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

function obterValor(item: any, campos: string[]) {
  for (const campo of campos) {
    if (item?.[campo] !== undefined && item?.[campo] !== null && item?.[campo] !== "") {
      return item[campo];
    }
  }

  return "-";
}

function obterSaudacao() {
  const hora = new Date().getHours();

  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function obterDataFormatada() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function gerarResumoMercado(ativos: any[]) {
  const ativoComVariacao = ativos.find((item) => {
    const valor = Number(item?.variacao_24h);
    return !Number.isNaN(valor);
  });

  if (!ativoComVariacao) {
    return "Aprenda a interpretar empresas, indicadores, rankings e cenário do dia com a IA do Dash.";
  }

  const variacao = Number(ativoComVariacao.variacao_24h);
  const ativo = ativoComVariacao.ativo || "um dos ativos monitorados";

  if (variacao > 0) {
    return `O mercado começa com ${ativo} em alta de ${formatarNumero(variacao)}% nas últimas 24h.`;
  }

  if (variacao < 0) {
    return `O mercado começa com ${ativo} em queda de ${formatarNumero(variacao)}% nas últimas 24h.`;
  }

  return `O mercado começa estável em ${ativo}, com variação próxima de zero.`;
}

function classeClassificacao(classificacao: string) {
  const valor = classificacao?.toLowerCase() || "";

  if (valor.includes("forte")) {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  }

  if (valor.includes("risco")) {
    return "border-red-400/30 bg-red-400/10 text-red-300";
  }

  return "border-amber-400/30 bg-amber-400/10 text-amber-300";
}

function gerarMotivoEmpresa(item: any) {
  const dividendYield = Number(item?.dividend_yield);
  const roe = Number(item?.roe);
  const pl = Number(item?.pl);
  const margem = Number(item?.margem_liquida);
  const divida = Number(item?.divida_liquida_ebitda);

  if (!Number.isNaN(dividendYield) && dividendYield >= 8) {
    return "Dividend Yield em destaque";
  }

  if (!Number.isNaN(roe) && roe >= 20) {
    return "ROE forte na comparação";
  }

  if (!Number.isNaN(pl) && pl > 0 && pl <= 8) {
    return "P/L abaixo da média da base";
  }

  if (!Number.isNaN(margem) && margem >= 15) {
    return "Margem líquida saudável";
  }

  if (!Number.isNaN(divida) && divida >= 2) {
    return "Atenção ao endividamento";
  }

  return "Empresa monitorada pelo Dash";
}

export default async function Home() {
  let empresas: any[] = [];
  let ranking: any[] = [];
  let empresasDoDiaApi: any[] = [];
  let macro: any = {
    indicadores: [],
    ativos: [],
  };

  let erro = false;

  try {
    const [empresasApi, rankingApi, macroApi, empresasDoDiaResposta] = await Promise.all([
      buscarEmpresas(),
      buscarRanking(),
      buscarMacro(),
      buscarEmpresasDoDia(),
    ]);

    empresas = Array.isArray(empresasApi) ? empresasApi : [];
    ranking = Array.isArray(rankingApi) ? rankingApi : [];
    empresasDoDiaApi = Array.isArray(empresasDoDiaResposta) ? empresasDoDiaResposta : [];
    macro = macroApi || { indicadores: [], ativos: [] };
  } catch {
    erro = true;
  }

  const indicadores = Array.isArray(macro?.indicadores) ? macro.indicadores : [];
  const ativos = Array.isArray(macro?.ativos) ? macro.ativos : [];

  const indicadoresHome = indicadores.slice(0, 3);
  const ativosHome = ativos.slice(0, 3);
  const mercadoCards = [...indicadoresHome, ...ativosHome].slice(0, 6);
  const empresasDoDia = (empresasDoDiaApi.length > 0 ? empresasDoDiaApi : ranking.length > 0 ? ranking : empresas).slice(0, 3);
  const rankingHome = ranking.slice(0, 5);

  const saudacao = obterSaudacao();
  const dataHoje = obterDataFormatada();
  const resumoMercado = gerarResumoMercado(ativosHome);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
<Header />
      <HomeHero
        saudacao={saudacao}
        dataHoje={dataHoje}
        resumoMercado={resumoMercado}
        erro={erro}
        empresas={empresas}
        ranking={ranking}
        indicadores={indicadores}
        ativos={ativos}
      />


      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Hábito</p>
            <h2 className="mt-2 text-2xl font-semibold">Resumo diário</h2>
            <p className="mt-3 text-sm text-slate-300">
              Uma entrada rápida para entender o mercado antes de começar o dia.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Produto</p>
            <h2 className="mt-2 text-2xl font-semibold">Dados simples</h2>
            <p className="mt-3 text-sm text-slate-300">
              Empresas, ranking, macro e páginas individuais por ticker.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Próximo diferencial</p>
            <h2 className="mt-2 text-2xl font-semibold">IA de análise</h2>
            <p className="mt-3 text-sm text-slate-300">
              Explicações simples sobre empresas, riscos e indicadores.
            </p>
          </div>
        </div>

        <section className="mt-14">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                📈 Mercado hoje
              </p>
              <h2 className="mt-2 text-3xl font-bold">O pulso do dia em poucos segundos</h2>
            </div>

            <Link href="/macro" className="text-sm font-semibold text-sky-300 hover:underline">
              Ver painel macro →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mercadoCards.map((item: any, index: number) => {
              const titulo = item.indicador || item.ativo || `Indicador ${index + 1}`;
              const valor = item.indicador
                ? formatarValorMacro(item.valor, item.unidade)
                : `R$ ${formatarNumero(item.preco_brl)}`;
              const descricao = item.indicador
                ? item.descricao || "Indicador macroeconômico"
                : `Variação 24h: ${formatarNumero(item.variacao_24h)}%`;

              return (
                <div
                  key={`${titulo}-${index}`}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6"
                >
                  <p className="text-sm text-slate-400">{titulo}</p>
                  <p className="mt-2 text-4xl font-bold text-white">{valor}</p>
                  <p className="mt-2 text-sm text-slate-400">{descricao}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                  🔥 Empresas do dia
                </p>
                <h2 className="mt-2 text-3xl font-bold">3 empresas para observar</h2>
              </div>

              <Link href="/empresas" className="text-sm font-semibold text-sky-300 hover:underline">
                Ver empresas →
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {empresasDoDia.map((item: any, index: number) => {
                const ticker = obterValor(item, ["ticker", "Ticker"]);
                const empresa = obterValor(item, ["empresa", "Empresa", "nome"]);
                const setor = obterValor(item, ["setor", "Setor"]);
                const classificacao = String(obterValor(item, ["classificacao", "Classificação"]));

                return (
                  <Link
                    key={`${ticker}-${index}`}
                    href={`/empresa/${ticker}`}
                    className="rounded-3xl border border-white/10 bg-slate-950 p-5 transition hover:border-sky-400/40 hover:bg-sky-400/5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{setor}</p>
                        <h3 className="mt-1 text-2xl font-bold">{ticker}</h3>
                        <p className="mt-1 text-slate-300">{empresa}</p>
                      </div>

                      <div className="md:text-right">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${classeClassificacao(classificacao)}`}>
                          {classificacao}
                        </span>
                        <p className="mt-3 text-sm text-slate-400">
                          {item.motivo || gerarMotivoEmpresa(item)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
              ⭐ Minha watchlist
            </p>
            <h2 className="mt-2 text-3xl font-bold">Acompanhe suas favoritas</h2>
            <p className="mt-4 text-slate-300">
              Em breve, você poderá montar sua watchlist e receber um resumo diário das empresas que mais acompanha.
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Sugestão de uso</p>
              <p className="mt-2 text-lg font-semibold">
                Salve o Dash como app no celular e abra todos os dias pela manhã.
              </p>
            </div>

            <Link
              href="/beta"
              className="mt-6 inline-flex rounded-full bg-sky-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-sky-300"
            >
              Entrar na lista beta
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              🧠 Insight do dia
            </p>
            <h2 className="mt-2 text-3xl font-bold">Dados bons precisam ser simples</h2>
            <p className="mt-4 text-slate-300">
              Empresas com boa rentabilidade, margem saudável e endividamento controlado tendem a chamar mais atenção em análises fundamentalistas.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              O Dash Diário organiza esses sinais para facilitar a leitura, sem prometer resultado e sem recomendar compra ou venda.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Ranking
                </p>
                <h2 className="mt-2 text-3xl font-bold">Empresas em destaque</h2>
              </div>

              <Link href="/ranking" className="text-sm font-semibold text-sky-300 hover:underline">
                Ver ranking →
              </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Ticker</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Classificação</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingHome.map((item: any, index: number) => {
                    const ticker = obterValor(item, ["ticker", "Ticker"]);
                    const empresa = obterValor(item, ["empresa", "Empresa", "nome"]);
                    const classificacao = String(obterValor(item, ["classificacao", "Classificação"]));

                    return (
                      <tr key={`${ticker}-${index}`} className="border-t border-white/10">
                        <td className="px-4 py-3 font-bold text-sky-300">{ticker}</td>
                        <td className="px-4 py-3 text-slate-300">{empresa}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${classeClassificacao(classificacao)}`}>
                            {classificacao}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
              🤖 IA do Dash
            </p>
            <h2 className="mt-2 text-3xl font-bold">Pergunte em linguagem simples</h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                “Quais empresas parecem mais fortes hoje?”
              </p>
              <p className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                “Compare PETR4 e VALE3.”
              </p>
              <p className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                “Explique o mercado de hoje de forma simples.”
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              🔔 Volte amanhã
            </p>
            <h2 className="mt-2 text-3xl font-bold">Seu resumo será atualizado</h2>
            <p className="mt-4 text-slate-300">
              A proposta do Dash Diário é criar uma rotina: abrir, entender o cenário, ver os destaques e seguir o dia com mais clareza.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/feedback"
                className="rounded-full bg-sky-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-sky-300"
              >
                Avaliar o Dash
              </Link>

              <Link
                href="/beta"
                className="rounded-full border border-white/20 px-5 py-3 font-bold text-white transition hover:border-sky-400 hover:text-sky-300"
              >
                Participar da beta
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
