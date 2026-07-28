"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  if (resumoMercado) partes.push(resumoMercado);

  if (di) {
    const valor = valorCampo(di);
    const unidade = textoCampo(di, ["unidade"]);
    if (valor) partes.push(`DI acumulado no mês: ${formatarPercentual(valor, unidade)}.`);
  }

  if (selic) {
    const valor = valorCampo(selic);
    const unidade = textoCampo(selic, ["unidade"]);
    if (valor) partes.push(`Selic acumulada no mês: ${formatarPercentual(valor, unidade)}.`);
  }

  if (bitcoin && valorCampo(bitcoin)) {
    partes.push("Bitcoin também entra no radar como termômetro de apetite a risco.");
  }

  return partes.length > 0
    ? partes.slice(0, 4)
    : ["Seu Dash reúne mercado, empresas e indicadores para começar o dia com contexto."];
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
    const timer = window.setTimeout(() => {
      try {
        const token = localStorage.getItem("dash_token");
        const usuarioSalvo = localStorage.getItem("dash_usuario");

        if (token || usuarioSalvo) {
          setUsuario(usuarioSalvo ? JSON.parse(usuarioSalvo) : { nome: "investidor" });
        }
      } catch {
        setUsuario(null);
      } finally {
        setSessaoVerificada(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const estaLogado = sessaoVerificada && !!usuario;
  const analiseEducativa = montarAnaliseEducativa({ resumoMercado, indicadores, ativos });

  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-[#020817]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.17),transparent_32%),radial-gradient(circle_at_82%_30%,rgba(16,185,129,0.09),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-12 sm:px-6 md:pb-20 md:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
            Todo dia começa com o Dash
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            {dataHoje}
          </p>

          {estaLogado ? (
            <>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
                {saudacao}, {primeiroNome(usuario?.nome)}.
                <span className="block bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Este é o seu mercado hoje.
                </span>
              </h1>

              <div className="mt-6 space-y-2 text-base leading-7 text-slate-300">
                {analiseEducativa.map((linha) => <p key={linha}>{linha}</p>)}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/empresas" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-sky-400 px-7 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-300">
                  Abrir meu Dash
                </Link>
                <Link href="/ia" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-7 font-bold text-white transition hover:border-sky-300/50 hover:bg-sky-300/8">
                  Perguntar para a IA
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-[4.3rem] lg:leading-[1.02]">
                O mercado muda todo dia.
                <span className="mt-2 block bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Seu jeito de acompanhar também.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Empresas, indicadores, rankings e IA em uma experiência feita para
                você entender o cenário e começar o dia com mais clareza.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/cadastro" className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-sky-400 px-8 text-base font-black text-slate-950 shadow-[0_18px_50px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 hover:bg-sky-300">
                  Experimentar grátis
                  <span aria-hidden="true" className="ml-2">→</span>
                </Link>
                <a href="#instalar" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-7 text-sm font-bold text-white transition hover:border-sky-300/50 hover:bg-sky-300/8">
                  Ver como instalar no celular
                </a>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <span className="text-emerald-300">✓</span>
                Gratuito para começar · IA liberada durante o beta
              </p>
            </>
          )}

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/8 pt-6">
            <div>
              <p className="text-2xl font-black text-white">{empresas.length || "100"}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">empresas</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{ranking.length || "20"}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">destaques</p>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-300">IA</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">em linguagem simples</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-sky-400/15 via-transparent to-emerald-400/10 blur-2xl" />
          <div className="relative rounded-[2rem] border border-sky-300/15 bg-[#061126]/92 p-3 shadow-[0_32px_100px_rgba(0,0,0,0.45)] sm:p-4">
            <div className="rounded-[1.55rem] border border-white/8 bg-[#030817] p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div className="flex items-center gap-3">
                  <Image src="/dash-icon-navbar.png" alt="" width={42} height={42} className="h-10 w-10 rounded-xl object-cover" />
                  <div>
                    <p className="font-black text-white">Seu Dash de hoje</p>
                    <p className="text-xs text-slate-500">contexto antes do ruído</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-300">
                  atualizado
                </span>
              </div>

              <div className="mt-5 rounded-3xl border border-sky-300/15 bg-gradient-to-br from-sky-300/12 to-cyan-300/[0.03] p-5">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-sky-300">Mercado do dia</p>
                <p className="mt-3 text-lg font-bold leading-7 text-white">
                  {erro ? "Os dados reais estão sendo atualizados." : resumoMercado}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Os sinais que importam, organizados em uma leitura rápida.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-4">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">Empresa</p>
                  <p className="mt-3 text-xl font-black text-white">PETR4</p>
                  <p className="mt-1 text-xs text-slate-500">indicadores organizados</p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-4">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">Ranking</p>
                  <div className="mt-4 flex h-14 items-end gap-2" aria-hidden="true">
                    <span className="h-6 w-4 rounded-t bg-sky-400" />
                    <span className="h-10 w-4 rounded-t bg-emerald-400" />
                    <span className="h-14 w-4 rounded-t bg-amber-300" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-3xl border border-white/8 bg-white/[0.035] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/12 text-xl" aria-hidden="true">✦</div>
                <div>
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-300">IA do Dash</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    “Me explica o ROE desta empresa de um jeito simples?”
                  </p>
                </div>
              </div>

              <Link href={estaLogado ? "/perfil" : "/cadastro"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-white px-6 text-sm font-black text-slate-950 transition hover:bg-sky-100">
                {estaLogado ? "Abrir meu perfil" : "Criar gratuitamente meu Dash"}
              </Link>
            </div>
          </div>
          <div className="mx-auto -mt-1 h-3 w-4/5 rounded-b-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 opacity-70 blur-sm" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-3 px-5 pb-12 sm:px-6 md:grid-cols-3 md:pb-16">
        {[
          ["01", "Abra", "Veja o cenário do dia em poucos minutos."],
          ["02", "Entenda", "Use dados e IA sem linguagem complicada."],
          ["03", "Leve com você", "Instale na tela inicial e transforme em hábito."],
        ].map(([numero, titulo, texto]) => (
          <div key={numero} className="flex gap-4 rounded-3xl border border-white/8 bg-white/[0.025] p-5">
            <span className="text-xs font-black tracking-widest text-sky-300">{numero}</span>
            <div>
              <p className="font-black text-white">{titulo}</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">{texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
