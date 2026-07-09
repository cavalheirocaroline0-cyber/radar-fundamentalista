import Header from "@/components/Header";
import { buscarEmpresaPorTicker } from "@/lib/api";

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

function classificarScore(score: number | null) {
  if (score === null) return "sem score suficiente para uma leitura conclusiva";
  if (score >= 80) return "com destaque positivo no Radar";
  if (score >= 65) return "com bons sinais, mas ainda exige comparação";
  if (score >= 50) return "em zona intermediária de análise";
  return "com pontos de atenção relevantes";
}

function gerarPontosFortes(empresa: any) {
  const pontos: string[] = [];

  const score = numero(empresa.score);
  const roe = numero(empresa.roe);
  const dy = numero(empresa.dividend_yield);
  const margem = numero(empresa.margem_liquida);
  const liquidez = numero(empresa.liquidez_2_meses);
  const divida = numero(empresa.divida_liquida_ebitda);

  if (score !== null && score >= 75) {
    pontos.push("Score elevado dentro da metodologia do Radar.");
  }

  if (roe !== null && roe >= 15) {
    pontos.push("ROE acima de 15%, indicando boa rentabilidade sobre o patrimônio.");
  }

  if (dy !== null && dy >= 6) {
    pontos.push("Dividend Yield relevante, podendo indicar bom histórico de distribuição de proventos.");
  }

  if (margem !== null && margem >= 15) {
    pontos.push("Margem líquida saudável, sinalizando boa conversão de receita em lucro.");
  }

  if (liquidez !== null && liquidez > 1000000) {
    pontos.push("Boa liquidez, o que facilita entrada e saída do ativo no mercado.");
  }

  if (divida !== null && divida <= 2) {
    pontos.push("Endividamento controlado em relação ao EBITDA.");
  }

  if (pontos.length === 0) {
    pontos.push("A empresa não apresentou destaques fortes automáticos nos critérios atuais do Radar.");
  }

  return pontos;
}

function gerarPontosAtencao(empresa: any) {
  const pontos: string[] = [];

  const pl = numero(empresa.pl);
  const pvp = numero(empresa.pvp);
  const roe = numero(empresa.roe);
  const dy = numero(empresa.dividend_yield);
  const margem = numero(empresa.margem_liquida);
  const divida = numero(empresa.divida_liquida_ebitda);
  const score = numero(empresa.score);

  if (score !== null && score < 50) {
    pontos.push("Score baixo dentro da metodologia do Radar.");
  }

  if (pl !== null && pl > 20) {
    pontos.push("P/L elevado, o que pode indicar preço mais esticado em relação ao lucro.");
  }

  if (pvp !== null && pvp > 3) {
    pontos.push("P/VP alto, exigindo maior atenção ao preço pago pelo patrimônio.");
  }

  if (roe !== null && roe < 8) {
    pontos.push("ROE baixo, indicando rentabilidade limitada sobre o patrimônio.");
  }

  if (dy !== null && dy < 2) {
    pontos.push("Dividend Yield baixo para quem busca renda passiva.");
  }

  if (margem !== null && margem < 5) {
    pontos.push("Margem líquida apertada, o que pode indicar menor eficiência operacional.");
  }

  if (divida !== null && divida > 3) {
    pontos.push("Dívida líquida/EBITDA elevada, exigindo análise mais cuidadosa do endividamento.");
  }

  if (pontos.length === 0) {
    pontos.push("Nenhum alerta crítico foi identificado automaticamente pelos critérios atuais.");
  }

  return pontos;
}

function gerarLeituraIndicadores(empresa: any) {
  const pl = numero(empresa.pl);
  const pvp = numero(empresa.pvp);
  const roe = numero(empresa.roe);
  const dy = numero(empresa.dividend_yield);

  const leituras: string[] = [];

  if (pl !== null) {
    if (pl <= 8) {
      leituras.push("O P/L está em uma faixa considerada baixa, o que pode indicar preço atrativo, mas também exige entender o motivo do desconto.");
    } else if (pl <= 15) {
      leituras.push("O P/L está em uma faixa intermediária, sugerindo valuation moderado em relação ao lucro.");
    } else {
      leituras.push("O P/L está em uma faixa mais elevada, indicando que o mercado pode estar pagando mais caro pelo lucro da empresa.");
    }
  }

  if (pvp !== null) {
    if (pvp <= 1) {
      leituras.push("O P/VP próximo ou abaixo de 1 sugere que a empresa negocia perto do valor patrimonial.");
    } else if (pvp <= 2.5) {
      leituras.push("O P/VP está em uma faixa moderada, dependendo da qualidade e rentabilidade do negócio.");
    } else {
      leituras.push("O P/VP está elevado, o que exige maior confiança na capacidade futura de geração de resultado.");
    }
  }

  if (roe !== null) {
    if (roe >= 15) {
      leituras.push("O ROE indica boa capacidade de geração de retorno sobre o patrimônio.");
    } else if (roe >= 8) {
      leituras.push("O ROE está em nível intermediário, exigindo comparação com empresas do mesmo setor.");
    } else {
      leituras.push("O ROE está baixo, o que pode indicar menor eficiência na geração de retorno.");
    }
  }

  if (dy !== null) {
    if (dy >= 6) {
      leituras.push("O Dividend Yield é relevante e pode chamar atenção de investidores focados em proventos.");
    } else if (dy >= 3) {
      leituras.push("O Dividend Yield está em faixa moderada.");
    } else {
      leituras.push("O Dividend Yield é baixo, então a tese pode depender mais de crescimento ou valorização.");
    }
  }

  if (leituras.length === 0) {
    leituras.push("Ainda não há dados suficientes para gerar uma leitura completa dos indicadores.");
  }

  return leituras;
}

function gerarConclusao(empresa: any) {
  const score = numero(empresa.score);
  const classificacaoScore = classificarScore(score);

  return `${empresa.ticker} aparece ${classificacaoScore}. A leitura deve considerar o setor, o momento da empresa, a qualidade dos dados e a comparação com concorrentes. O Radar ajuda a organizar os indicadores, mas a decisão final exige análise complementar.`;
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

  const pontosFortes = empresa ? gerarPontosFortes(empresa) : [];
  const pontosAtencao = empresa ? gerarPontosAtencao(empresa) : [];
  const leituraIndicadores = empresa ? gerarLeituraIndicadores(empresa) : [];
  const conclusao = empresa ? gerarConclusao(empresa) : "";

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
                  {formatarDinheiro(empresa.preco)}
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
                  {formatarDinheiro(empresa.liquidez_2_meses)}
                </p>
              </div>
            </section>

            <section className="mt-10 rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 to-cyan-400/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Análise Radar
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Leitura fundamentalista simples
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                {conclusao}
              </p>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-2xl font-bold text-emerald-300">
                  Pontos fortes
                </h3>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                  {pontosFortes.map((ponto) => (
                    <li key={ponto} className="flex gap-3">
                      <span className="text-emerald-300">✓</span>
                      <span>{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-2xl font-bold text-amber-300">
                  Pontos de atenção
                </h3>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                  {pontosAtencao.map((ponto) => (
                    <li key={ponto} className="flex gap-3">
                      <span className="text-amber-300">!</span>
                      <span>{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-2xl font-bold">
                Leitura dos indicadores
              </h3>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {leituraIndicadores.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5 text-sm leading-6 text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-xl font-bold text-slate-200">
                Aviso importante
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Esta análise é gerada automaticamente com base nos indicadores
                disponíveis no Radar Fundamentalista. Ela tem finalidade
                educacional e informativa, não representa recomendação de compra,
                venda ou manutenção de qualquer ativo.
              </p>

              <p className="mt-4 text-xs text-slate-500">
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
