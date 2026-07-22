"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HomeHeroProps = {
  saudacao: string;
  dataHoje: string;
  resumoMercado: string;
  erro: boolean;
  empresas: unknown[];
  ranking: unknown[];
  indicadores: unknown[];
  ativos: unknown[];
};

type UsuarioDash = {
  nome?: string;
  email?: string;
  plano?: string;
  status_assinatura?: string;
};

function primeiroNome(nome?: string) {
  if (!nome) return "investidor";
  return nome.trim().split(" ")[0] || "investidor";
}

function comoRegistro(item: unknown) {
  if (item && typeof item === "object") {
    return item as Record<string, unknown>;
  }

  return {};
}

function textoCampo(item: Record<string, unknown>, campos: string[]) {
  for (const campo of campos) {
    const valor = item[campo];

    if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
      return String(valor);
    }
  }

  return "";
}

function valorCampo(item: Record<string, unknown>) {
  for (const campo of ["valor", "preco", "preco_atual", "cotacao", "ultimo", "value"]) {
    const valor = item[campo];

    if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
      return String(valor);
    }
  }

  return "";
}

function procurarPorTermos(lista: unknown[], termos: string[]) {
  return lista
    .map(comoRegistro)
    .find((item) => {
      const base = [
        textoCampo(item, ["indicador", "nome", "descricao", "ticker", "ativo", "simbolo", "codigo"]),
        textoCampo(item, ["fonte", "categoria", "tipo"]),
      ]
        .join(" ")
        .toLowerCase();

      return termos.some((termo) => base.includes(termo.toLowerCase()));
    });
}

function formatarPercentual(valor: string, unidade?: string) {
  if (!valor) return "";

  const numero = Number(String(valor).replace(",", "."));

  if (Number.isNaN(numero)) {
    return unidade ? `${valor} ${unidade}` : valor;
  }

  const formatado = numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (unidade && unidade.includes("%")) {
    return `${formatado}${unidade.replace("%", "%").replace(" a.m.", " a.m.")}`;
  }

  return `${formatado}${unidade ? ` ${unidade}` : ""}`;
}

function montarAnaliseEducativa({
  resumoMercado,
  indicadores,
  ativos,
}: {
  resumoMercado: string;
  indicadores: unknown[];
  ativos: unknown[];
}) {
  const di = procurarPorTermos(indicadores, ["di acumulado", "cdi", "di/cdi"]);
  const selic = procurarPorTermos(indicadores, ["selic acumulada", "selic"]);
  const bitcoin = procurarPorTermos(ativos, ["bitcoin", "btc"]);

  const partes: string[] = [];

  if (resumoMercado) {
    partes.push(resumoMercado);
  }

  if (di) {
    const valor = valorCampo(di);
    const unidade = textoCampo(di, ["unidade"]);

    if (valor) {
      partes.push(`O DI acumulado no mês está em ${formatarPercentual(valor, unidade)}, um indicador importante para entender o custo do dinheiro e a referência de renda fixa.`);
    }
  }

  if (selic) {
    const valor = valorCampo(selic);
    const unidade = textoCampo(selic, ["unidade"]);

    if (valor) {
      partes.push(`A Selic acumulada no mês aparece em ${formatarPercentual(valor, unidade)}, ajudando a medir o ritmo dos juros no período.`);
    }
  }

  if (bitcoin) {
    const nome = textoCampo(bitcoin, ["nome", "ativo", "ticker", "simbolo"]) || "Bitcoin";
    const valor = valorCampo(bitcoin);

    if (valor) {
      partes.push(`${nome} também entra no radar como termômetro de apetite a risco no mercado.`);
    }
  }

  if (partes.length === 0) {
    return [
      "Seu Dash de hoje reúne mercado, empresas, ranking e indicadores macro para ajudar você a começar o dia com mais contexto.",
      "Use esses dados como ponto de partida educativo antes de analisar empresas ou tomar decisões financeiras.",
    ];
  }

  return partes.slice(0, 4);
}

export default function HomeHero({
  saudacao,
  dataHoje,
  resumoMercado,
  erro,
  empresas,
  ranking,
  indicadores,
  ativos,
}: HomeHeroProps) {
  const [usuario, setUsuario] = useState<UsuarioDash | null>(null);
  const [sessaoVerificada, setSessaoVerificada] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("dash_token");
      const usuarioSalvo = localStorage.getItem("dash_usuario");

      if (token || usuarioSalvo) {
        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        } else {
          setUsuario({ nome: "investidor" });
        }
      }
    } catch {
      setUsuario(null);
    } finally {
      setSessaoVerificada(true);
    }
  }, []);

  const estaLogado = sessaoVerificada && !!usuario;
  const nome = primeiroNome(usuario?.nome);

  const analiseEducativa = montarAnaliseEducativa({
    resumoMercado,
    indicadores,
    ativos,
  });

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-300">
            🌟 Todo dia começa com o Dash
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
            {dataHoje}
          </p>

          {estaLogado ? (
            <>
              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
                {saudacao}, {nome}.
              </h1>

              <div className="mt-6 max-w-2xl space-y-3 text-lg leading-8 text-slate-300">
                {analiseEducativa.map((linha) => (
                  <p key={linha}>{linha}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/empresas"
                  className="inline-flex justify-center rounded-full bg-sky-400 px-8 py-4 text-base font-black text-slate-950 transition hover:bg-sky-300"
                >
                  Ver empresas
                </Link>

                <Link
                  href="/ranking"
                  className="inline-flex justify-center rounded-full border border-white/10 px-6 py-4 text-sm font-bold text-slate-300 transition hover:border-sky-400 hover:text-sky-300"
                >
                  Ver ranking
                </Link>

                <Link
                  href="/ia"
                  className="inline-flex justify-center rounded-full border border-white/10 px-6 py-4 text-sm font-bold text-slate-300 transition hover:border-sky-400 hover:text-sky-300"
                >
                  Abrir IA
                </Link>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                A IA é um recurso Premium. O Dash é educativo e não faz recomendações de investimento.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
                Entenda o mercado em poucos minutos.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Acompanhe empresas, indicadores, rankings e receba explicações simples
                com a IA do Dash.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/cadastro"
                  className="inline-flex justify-center rounded-full bg-sky-400 px-8 py-4 text-base font-black text-slate-950 transition hover:bg-sky-300"
                >
                  Criar minha conta grátis
                </Link>

                <Link
                  href="/entrar"
                  className="inline-flex justify-center rounded-full border border-white/10 px-6 py-4 text-sm font-bold text-slate-300 transition hover:border-sky-400 hover:text-sky-300"
                >
                  Já tenho conta
                </Link>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Gratuito para começar. Não fazemos recomendações de investimento.
                <Link href="/planos" className="ml-1 font-bold text-sky-300 hover:text-sky-200">
                  Conhecer planos.
                </Link>
              </p>
            </>
          )}

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-black text-white">
                {empresas.length || "100"}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                empresas
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-black text-white">
                {ranking.length || "20"}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                análises
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-black text-white">
                IA
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                premium
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-sky-950/30 backdrop-blur">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-black text-white">
                  Dash Diário
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {estaLogado ? "Seu mercado do dia" : "Mercado do dia"}
                </p>
              </div>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                atualizado
              </span>
            </div>

            <div className="mt-5 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                Mercado do dia
              </p>

              <p className="mt-3 text-lg font-bold leading-7 text-white">
                {erro ? "Dados reais em atualização." : resumoMercado}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                O Dash organiza os principais sinais para você começar o dia
                com contexto, não com ruído.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Empresa acompanhada
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-black text-white">
                      PETR4
                    </p>
                    <p className="text-sm text-slate-500">
                      indicadores organizados
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                    ver
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Ranking
                </p>

                <div className="mt-4">
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-4/5 rounded-full bg-sky-400" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">
                    Compare empresas com mais clareza.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-lg">
                  🤖
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                    Pergunta para a IA
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    “Dash, me explica o que é ROE em linguagem simples?”
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    A IA traduz indicadores para uma leitura mais fácil e educativa.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={estaLogado ? "/perfil" : "/cadastro"}
              className="mt-5 inline-flex w-full justify-center rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-sky-100"
            >
              {estaLogado ? "Abrir meu perfil" : "Criar gratuitamente meu Dash"}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-black text-white">
            1. Mercado do dia
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Veja os principais indicadores em uma tela simples para começar sua rotina.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-black text-white">
            2. Empresas acompanhadas
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Salve empresas, compare dados e acompanhe o que importa para seu estudo.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-black text-white">
            3. IA explicando dados
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Receba explicações simples sobre indicadores, rankings e cenário de mercado.
          </p>
        </div>
      </div>
    </section>
  );
}
