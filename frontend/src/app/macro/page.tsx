import Header from "@/components/Header";
import { buscarMacro } from "@/lib/api";

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

function formatarValorMacro(
  valor: number | string | null | undefined,
  unidade?: string | null
) {
  const n = numero(valor);

  if (n === null) return "-";

  const unidadeNormalizada = unidade?.toLowerCase() || "";

  if (
    unidadeNormalizada.includes("%") ||
    unidadeNormalizada.includes("percentual")
  ) {
    return `${formatarNumero(n)}%`;
  }

  if (
    unidadeNormalizada.includes("r$") ||
    unidadeNormalizada.includes("real") ||
    unidadeNormalizada.includes("brl")
  ) {
    return `R$ ${formatarNumero(n)}`;
  }

  return `${formatarNumero(n)} ${unidade || ""}`.trim();
}

function formatarData(data: string | null | undefined) {
  if (!data) return "-";

  const partes = data.split("-");

  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function normalizarTexto(texto: string | null | undefined) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterImpactoIndicador(nome: string) {
  const indicador = normalizarTexto(nome);

  if (indicador.includes("selic")) {
    return {
      mercado:
        "A Selic influencia o custo do dinheiro no Brasil. Quando está alta, renda fixa tende a ficar mais atrativa e empresas endividadas podem sofrer mais. Quando cai, crédito e bolsa podem ganhar força.",
      vida:
        "Afeta financiamento imobiliário, empréstimos, cartão, consignado, rendimento de CDB/Tesouro Selic e decisão entre gastar, investir ou quitar dívidas.",
      decisao:
        "Olhar Selic ajuda a decidir se vale priorizar renda fixa, amortizar dívidas caras ou esperar melhores condições de crédito.",
    };
  }

  if (indicador.includes("ipca") || indicador.includes("inflacao")) {
    return {
      mercado:
        "O IPCA mede a inflação. Inflação alta pressiona juros, reduz poder de compra e pode prejudicar empresas que não conseguem repassar custos.",
      vida:
        "Aparece no supermercado, aluguel, escola, combustível, plano de saúde e reajustes de contratos. Também afeta investimentos atrelados à inflação.",
      decisao:
        "Ajuda a entender se seu dinheiro está perdendo poder de compra e se faz sentido buscar investimentos protegidos pela inflação.",
    };
  }

  if (indicador.includes("dolar") || indicador.includes("cambio")) {
    return {
      mercado:
        "O dólar impacta empresas exportadoras, importadoras, commodities, inflação e fluxo de capital estrangeiro. Alta do dólar pode favorecer exportadores e pressionar custos internos.",
      vida:
        "Afeta viagens internacionais, compras importadas, eletrônicos, combustível, alimentos ligados a commodities e produtos com componentes importados.",
      decisao:
        "Ajuda a planejar viagem, compras em dólar, proteção cambial e leitura de empresas sensíveis ao câmbio.",
    };
  }

  if (indicador.includes("cdi")) {
    return {
      mercado:
        "O CDI acompanha de perto a Selic e serve como referência para renda fixa, fundos DI e comparação de retorno com outros investimentos.",
      vida:
        "Afeta diretamente CDBs, fundos conservadores, contas remuneradas e investimentos pós-fixados.",
      decisao:
        "Ajuda a comparar se um investimento está rendendo bem em relação ao padrão do mercado.",
    };
  }

  return {
    mercado:
      "Este indicador ajuda a compor a leitura macroeconômica e pode influenciar juros, bolsa, crédito, câmbio ou expectativas dos investidores.",
    vida:
      "Indicadores macro aparecem em decisões do dia a dia por meio de preços, crédito, renda, consumo e investimentos.",
    decisao:
      "Acompanhar este dado ajuda a tomar decisões com mais contexto e menos achismo.",
  };
}

function obterImpactoAtivo(nome: string) {
  const ativo = normalizarTexto(nome);

  if (ativo.includes("bitcoin") || ativo.includes("btc")) {
    return {
      mercado:
        "O Bitcoin costuma refletir apetite por risco, liquidez global e interesse por criptoativos. Pode oscilar bastante e não se comporta como renda fixa.",
      vida:
        "Para a pessoa física, entra como ativo de risco. Pode ter valorização forte, mas também quedas intensas. Exige controle de exposição.",
      decisao:
        "Ajuda a observar o humor do mercado de risco e decidir se uma exposição em cripto faz sentido dentro do perfil pessoal.",
    };
  }

  if (ativo.includes("ouro")) {
    return {
      mercado:
        "O ouro costuma ser visto como proteção em momentos de incerteza, inflação global, crise ou busca por reserva de valor.",
      vida:
        "Pode aparecer como alternativa de proteção patrimonial, mas também oscila e não gera renda recorrente.",
      decisao:
        "Ajuda a pensar em diversificação e proteção em cenários de maior instabilidade.",
    };
  }

  if (ativo.includes("prata")) {
    return {
      mercado:
        "A prata mistura características de metal precioso e uso industrial. Pode reagir a ciclos econômicos e também a busca por proteção.",
      vida:
        "Para pessoa física, é mais uma alternativa de diversificação, mas costuma ter volatilidade e menor familiaridade que ouro.",
      decisao:
        "Ajuda a acompanhar metais e entender movimentos de proteção ou demanda industrial.",
    };
  }

  if (ativo.includes("dolar") || ativo.includes("usd")) {
    return {
      mercado:
        "O dólar é uma das principais variáveis do mercado brasileiro, influenciando inflação, empresas exportadoras, importadoras e commodities.",
      vida:
        "Impacta viagem, eletrônicos, compras internacionais, combustível e produtos importados.",
      decisao:
        "Ajuda no planejamento de gastos dolarizados e na análise de empresas expostas ao câmbio.",
    };
  }

  return {
    mercado:
      "Este ativo ajuda a observar movimentos de preço, risco e comportamento dos investidores.",
    vida:
      "Pode influenciar decisões de diversificação, proteção ou exposição a diferentes classes de ativos.",
    decisao:
      "Serve como apoio para acompanhar o cenário e comparar alternativas de investimento.",
  };
}

function gerarResumoMacro(indicadores: any[], ativos: any[]) {
  const nomesIndicadores = indicadores.map((item) =>
    normalizarTexto(item.indicador)
  );

  const temSelic = nomesIndicadores.some((nome) => nome.includes("selic"));
  const temIPCA = nomesIndicadores.some(
    (nome) => nome.includes("ipca") || nome.includes("inflacao")
  );
  const temDolar =
    nomesIndicadores.some((nome) => nome.includes("dolar")) ||
    ativos.some((item) => normalizarTexto(item.ativo).includes("dolar"));

  const leituras: string[] = [];

  if (temSelic) {
    leituras.push(
      "A Selic ajuda a entender o custo do dinheiro. Ela influencia crédito, financiamentos, renda fixa e a atratividade da bolsa."
    );
  }

  if (temIPCA) {
    leituras.push(
      "O IPCA mostra a pressão da inflação. Ele ajuda a entender perda de poder de compra, reajustes e expectativa de juros."
    );
  }

  if (temDolar) {
    leituras.push(
      "O dólar conecta o Brasil ao cenário global. Ele afeta importados, viagens, combustível, commodities e empresas com receita ou custos em moeda estrangeira."
    );
  }

  if (ativos.length > 0) {
    leituras.push(
      "Os ativos monitorados ajudam a observar apetite por risco, busca por proteção e movimentos alternativos ao mercado tradicional."
    );
  }

  if (leituras.length === 0) {
    leituras.push(
      "Os indicadores macro ajudam a transformar o cenário econômico em decisões mais conscientes sobre consumo, crédito e investimentos."
    );
  }

  return leituras;
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

  const resumoMacro = gerarResumoMacro(dados.indicadores, dados.ativos);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          Macro
        </p>

        <div className="mt-4 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">
              Indicadores macroeconômicos
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Acompanhe juros, inflação, câmbio, criptoativos e metais. Esses
              dados ajudam a entender o mercado, mas também aparecem nas
              decisões do dia a dia: crédito, consumo, viagem, investimentos e
              proteção do patrimônio.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
            <p className="text-sm text-slate-300">Itens monitorados</p>
            <p className="mt-2 text-5xl font-black text-sky-300">
              {erro ? "-" : dados.indicadores.length + dados.ativos.length}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Indicadores e ativos de mercado
            </p>
          </div>
        </div>

        {erro ? (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar os indicadores macro
            </h2>
            <p className="mt-3 text-slate-300">
              Confirme se a API está funcionando e se o backend está online.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-8 rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-400/15 to-slate-400/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
                Leitura macro do dia
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Onde esses indicadores entram na vida real?
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                Indicadores macro não servem apenas para o mercado financeiro.
                Eles aparecem em decisões comuns: contratar crédito, financiar
                imóvel, viajar, investir, formar reserva, comprar importados,
                proteger poder de compra e entender o comportamento das empresas.
              </p>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {resumoMacro.map((leitura) => (
                  <div
                    key={leitura}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-sm leading-6 text-slate-300"
                  >
                    {leitura}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="font-bold text-sky-300">Mercado</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Ajuda a entender bolsa, renda fixa, câmbio, commodities e
                    comportamento dos investidores.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="font-bold text-sky-300">Empresas</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Impacta custos, dívidas, margens, demanda, exportações,
                    importações e capacidade de crescimento.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="font-bold text-sky-300">Vida pessoal</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Entra em decisões de consumo, empréstimos, financiamento,
                    reserva de emergência, viagem e investimentos.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
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

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {dados.indicadores.map((item: any) => {
                  const impacto = obterImpactoIndicador(item.indicador);

                  return (
                    <div
                      key={item.indicador}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm text-slate-400">
                            {item.indicador}
                          </p>

                          <p className="mt-2 text-4xl font-bold text-sky-300">
                            {formatarValorMacro(item.valor, item.unidade)}
                          </p>

                          <p className="mt-3 text-sm text-slate-300">
                            {item.descricao || "Indicador macroeconômico"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {formatarData(item.data_referencia)}
                          </span>

                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {item.fonte || "Fonte não informada"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3">
                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                          <p className="text-sm font-bold text-sky-300">
                            Impacto no mercado
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {impacto.mercado}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                          <p className="text-sm font-bold text-sky-300">
                            Impacto na vida da pessoa
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {impacto.vida}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                          <p className="text-sm font-bold text-sky-300">
                            Decisão do dia a dia
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {impacto.decisao}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-12">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
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

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {dados.ativos.map((item: any) => {
                  const impacto = obterImpactoAtivo(item.ativo);

                  return (
                    <div
                      key={item.ativo}
                      className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm text-slate-300">{item.ativo}</p>

                          <p className="mt-2 text-4xl font-bold text-sky-300">
                            R$ {formatarNumero(item.preco_brl)}
                          </p>

                          <p className="mt-2 text-sm text-slate-400">
                            USD {formatarNumero(item.preco_usd)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
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

                      <div className="mt-6 grid gap-3">
                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                          <p className="text-sm font-bold text-sky-300">
                            Leitura de mercado
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {impacto.mercado}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                          <p className="text-sm font-bold text-sky-300">
                            Como isso chega na vida real
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {impacto.vida}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                          <p className="text-sm font-bold text-sky-300">
                            Como usar na decisão
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {impacto.decisao}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Como usar esta página no dia a dia?
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="font-bold text-sky-300">
                    Antes de investir
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Veja juros, inflação e câmbio para entender o cenário antes
                    de comparar empresas ou escolher renda fixa.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="font-bold text-sky-300">
                    Antes de tomar crédito
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Selic e inflação ajudam a entender se o custo do dinheiro
                    está caro e se vale adiar ou antecipar uma decisão.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <p className="font-bold text-sky-300">
                    Antes de consumir
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    IPCA e dólar ajudam a entender preços, reajustes, compras
                    importadas, viagens e perda de poder de compra.
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Esta leitura é educacional e automatizada. Ela não representa
                recomendação de investimento, crédito, compra ou venda de ativos.
              </p>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
