type Props = {
  insights: any;
};

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

function maiorItem(lista: any[] = []) {
  if (!lista.length) return null;

  return lista.reduce((maior, atual) => {
    return Number(atual.valor) > Number(maior.valor) ? atual : maior;
  }, lista[0]);
}

function gerarLeituraScore(mediaScore: number | null) {
  if (mediaScore === null) {
    return "Ainda não há score médio suficiente para interpretar a qualidade geral da base.";
  }

  if (mediaScore >= 70) {
    return "A base apresenta um score médio forte, indicando que uma boa parte das empresas monitoradas possui sinais fundamentalistas positivos.";
  }

  if (mediaScore >= 55) {
    return "A base está em uma zona intermediária: existem boas oportunidades, mas a comparação entre empresas é essencial para separar qualidade de risco.";
  }

  return "O score médio está baixo, sugerindo uma base com mais pontos de atenção. Neste cenário, filtros por ROE, dívida, liquidez e dividendos ajudam a evitar decisões por aparência.";
}

function gerarLeituraDY(mediaDY: number | null) {
  if (mediaDY === null) return "Ainda não há média suficiente de dividend yield.";

  if (mediaDY >= 6) {
    return "O dividend yield médio está elevado, o que pode atrair investidores focados em renda, mas exige cuidado para diferenciar dividendo sustentável de evento pontual.";
  }

  if (mediaDY >= 3) {
    return "O dividend yield médio está em faixa moderada, indicando uma base equilibrada entre empresas pagadoras de dividendos e empresas com menor distribuição.";
  }

  return "O dividend yield médio está baixo, então a leitura da base tende a depender mais de crescimento, rentabilidade e valorização do que de renda passiva.";
}

function gerarLeituraROE(mediaROE: number | null) {
  if (mediaROE === null) return "Ainda não há média suficiente de ROE.";

  if (mediaROE >= 15) {
    return "O ROE médio está saudável, sugerindo boa capacidade de geração de retorno sobre o patrimônio dentro da base analisada.";
  }

  if (mediaROE >= 8) {
    return "O ROE médio está em faixa intermediária. Isso pede comparação por setor, porque bancos, energia, commodities e varejo têm dinâmicas diferentes.";
  }

  return "O ROE médio está baixo, o que pode indicar menor eficiência de geração de retorno na base atual.";
}

export default function InsightsInterpretacao({ insights }: Props) {
  const medias = insights?.medias || {};

  const totalEmpresas = numero(medias.total_empresas);
  const mediaScore = numero(medias.media_score);
  const mediaDY = numero(medias.media_dy);
  const mediaROE = numero(medias.media_roe);

  const maiorClassificacao = maiorItem(insights?.por_classificacao || []);
  const maiorSetor = maiorItem(insights?.por_setor || []);
  const maiorFaixaScore = maiorItem(insights?.distribuicao_score || []);

  const topScore = insights?.top_score?.[0];
  const topDY = insights?.top_dividend_yield?.[0];
  const topROE = insights?.top_roe?.[0];

  const percentualClassificacao =
    maiorClassificacao && totalEmpresas
      ? (Number(maiorClassificacao.valor) / totalEmpresas) * 100
      : null;

  const leituras = [
    gerarLeituraScore(mediaScore),
    gerarLeituraDY(mediaDY),
    gerarLeituraROE(mediaROE),
  ];

  if (maiorClassificacao) {
    leituras.push(
      `A classificação mais frequente hoje é "${maiorClassificacao.label}", com ${maiorClassificacao.valor} empresas${percentualClassificacao !== null ? `, cerca de ${formatarNumero(percentualClassificacao)}% da base` : ""}.`
    );
  }

  if (maiorSetor) {
    leituras.push(
      `O setor mais presente na base é "${maiorSetor.label}", com ${maiorSetor.valor} empresas monitoradas.`
    );
  }

  if (maiorFaixaScore) {
    leituras.push(
      `A maior concentração de empresas está na faixa de score "${maiorFaixaScore.label}", o que ajuda a entender a qualidade geral da base.`
    );
  }

  return (
    <section className="mt-8 rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-400/15 to-slate-400/5 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
        Leitura do dia
      </p>

      <div className="mt-3 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-3xl font-bold">
            O que o painel está mostrando hoje?
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            O Dash Diário analisa a base de empresas a partir de score,
            classificação, rentabilidade, dividendos, valuation e liquidez.
            A leitura abaixo transforma os números do painel em interpretação
            simples para ajudar o usuário a entender o cenário geral.
          </p>

          <div className="mt-6 space-y-3">
            {leituras.map((leitura) => (
              <div
                key={leitura}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300"
              >
                {leitura}
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
          <h3 className="text-xl font-bold text-sky-300">
            Destaques automáticos
          </h3>

          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div>
              <p className="text-slate-500">Maior score</p>
              <p className="mt-1 font-bold">
                {topScore ? `${topScore.ticker} · Score ${topScore.score}` : "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Maior Dividend Yield</p>
              <p className="mt-1 font-bold">
                {topDY
                  ? `${topDY.ticker} · ${formatarNumero(topDY.dividend_yield)}%`
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Maior ROE</p>
              <p className="mt-1 font-bold">
                {topROE ? `${topROE.ticker} · ${formatarNumero(topROE.roe)}%` : "-"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-slate-200">
              Como ler o score?
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              O score é uma síntese dos indicadores. Ele não é recomendação de
              compra ou venda. Serve para priorizar análise e comparar empresas
              com mais rapidez.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <p className="font-bold text-sky-300">Score</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Ajuda a resumir a atratividade relativa da empresa considerando os
            indicadores disponíveis.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <p className="font-bold text-sky-300">Classificação</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Mostra uma leitura qualitativa simples, como Forte, Neutra,
            Atenção ou Oportunidade.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <p className="font-bold text-sky-300">Painel diário</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Serve para acompanhar mudanças da base, encontrar padrões e decidir
            onde olhar com mais atenção.
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-5 text-slate-500">
        Esta leitura é automática e educacional. Ela organiza os dados para
        facilitar a análise, mas não representa recomendação de investimento.
      </p>
    </section>
  );
}
