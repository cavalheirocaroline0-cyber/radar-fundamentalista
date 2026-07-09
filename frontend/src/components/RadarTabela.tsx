"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Empresa } from "@/lib/api";

type Props = {
  empresas: Empresa[];
};

type Ordenacao =
  | "score"
  | "pl"
  | "pvp"
  | "roe"
  | "dividend_yield"
  | "margem_liquida"
  | "liquidez_2_meses";

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

export default function RadarTabela({ empresas }: Props) {
  const [busca, setBusca] = useState("");
  const [setor, setSetor] = useState("Todos");
  const [classificacao, setClassificacao] = useState("Todas");
  const [scoreMinimo, setScoreMinimo] = useState("");
  const [dyMinimo, setDyMinimo] = useState("");
  const [roeMinimo, setRoeMinimo] = useState("");
  const [plMaximo, setPlMaximo] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("score");

  const setores = useMemo(() => {
    const lista = empresas
      .map((empresa) => empresa.setor)
      .filter((item): item is string => Boolean(item));

    return ["Todos", ...Array.from(new Set(lista)).sort()];
  }, [empresas]);

  const classificacoes = useMemo(() => {
    const lista = empresas
      .map((empresa) => empresa.classificacao)
      .filter((item): item is string => Boolean(item));

    return ["Todas", ...Array.from(new Set(lista)).sort()];
  }, [empresas]);

  const empresasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    const scoreMin = scoreMinimo ? Number(scoreMinimo) : null;
    const dyMin = dyMinimo ? Number(dyMinimo) : null;
    const roeMin = roeMinimo ? Number(roeMinimo) : null;
    const plMax = plMaximo ? Number(plMaximo) : null;

    return empresas
      .filter((empresa) => {
        const textoBusca = [
          empresa.ticker,
          empresa.empresa,
          empresa.setor,
          empresa.classificacao,
        ]
          .join(" ")
          .toLowerCase();

        const bateBusca = termo === "" || textoBusca.includes(termo);

        const bateSetor = setor === "Todos" || empresa.setor === setor;

        const bateClassificacao =
          classificacao === "Todas" || empresa.classificacao === classificacao;

        const score = numero(empresa.score);
        const dy = numero(empresa.dividend_yield);
        const roe = numero(empresa.roe);
        const pl = numero(empresa.pl);

        const bateScore = scoreMin === null || (score !== null && score >= scoreMin);
        const bateDy = dyMin === null || (dy !== null && dy >= dyMin);
        const bateRoe = roeMin === null || (roe !== null && roe >= roeMin);
        const batePl = plMax === null || (pl !== null && pl <= plMax);

        return (
          bateBusca &&
          bateSetor &&
          bateClassificacao &&
          bateScore &&
          bateDy &&
          bateRoe &&
          batePl
        );
      })
      .sort((a, b) => {
        const valorA = numero(a[ordenacao]);
        const valorB = numero(b[ordenacao]);

        if (valorA === null && valorB === null) return 0;
        if (valorA === null) return 1;
        if (valorB === null) return -1;

        if (ordenacao === "pl" || ordenacao === "pvp") {
          return valorA - valorB;
        }

        return valorB - valorA;
      });
  }, [
    busca,
    setor,
    classificacao,
    scoreMinimo,
    dyMinimo,
    roeMinimo,
    plMaximo,
    ordenacao,
    empresas,
  ]);

  return (
    <>
      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="text-sm text-slate-400">Buscar</label>
            <input
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Digite PETR4, Itaú, Banco, Energia..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Setor</label>
            <select
              value={setor}
              onChange={(evento) => setSetor(evento.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            >
              {setores.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">Classificação</label>
            <select
              value={classificacao}
              onChange={(evento) => setClassificacao(evento.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            >
              {classificacoes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-5">
          <div>
            <label className="text-sm text-slate-400">Score mínimo</label>
            <input
              value={scoreMinimo}
              onChange={(evento) => setScoreMinimo(evento.target.value)}
              type="number"
              placeholder="Ex: 70"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">DY mínimo</label>
            <input
              value={dyMinimo}
              onChange={(evento) => setDyMinimo(evento.target.value)}
              type="number"
              placeholder="Ex: 5"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">ROE mínimo</label>
            <input
              value={roeMinimo}
              onChange={(evento) => setRoeMinimo(evento.target.value)}
              type="number"
              placeholder="Ex: 10"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">P/L máximo</label>
            <input
              value={plMaximo}
              onChange={(evento) => setPlMaximo(evento.target.value)}
              type="number"
              placeholder="Ex: 12"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Ordenar por</label>
            <select
              value={ordenacao}
              onChange={(evento) => setOrdenacao(evento.target.value as Ordenacao)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            >
              <option value="score">Maior score</option>
              <option value="roe">Maior ROE</option>
              <option value="dividend_yield">Maior DY</option>
              <option value="margem_liquida">Maior margem</option>
              <option value="liquidez_2_meses">Maior liquidez</option>
              <option value="pl">Menor P/L</option>
              <option value="pvp">Menor P/VP</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">
            Mostrando{" "}
            <span className="font-bold text-emerald-300">
              {empresasFiltradas.length}
            </span>{" "}
            de {empresas.length} empresas.
          </p>

          <button
            onClick={() => {
              setBusca("");
              setSetor("Todos");
              setClassificacao("Todas");
              setScoreMinimo("");
              setDyMinimo("");
              setRoeMinimo("");
              setPlMaximo("");
              setOrdenacao("score");
            }}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
          >
            Limpar filtros
          </button>
        </div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
        <table className="w-full min-w-[1250px] text-left text-sm">
          <thead className="bg-white/10 text-slate-300">
            <tr>
              <th className="px-4 py-3">Ticker</th>
              <th className="px-4 py-3">Setor</th>
              <th className="px-4 py-3">Classificação</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">P/L</th>
              <th className="px-4 py-3">P/VP</th>
              <th className="px-4 py-3">ROE</th>
              <th className="px-4 py-3">DY</th>
              <th className="px-4 py-3">Margem</th>
              <th className="px-4 py-3">Dívida/EBITDA</th>
              <th className="px-4 py-3">Liquidez</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>

          <tbody>
            {empresasFiltradas.map((empresa) => (
              <tr key={empresa.ticker} className="border-t border-white/10">
                <td className="px-4 py-4 font-bold text-emerald-300">
                  <Link
                    href={`/empresa/${empresa.ticker}`}
                    className="transition hover:text-emerald-100 hover:underline"
                  >
                    {empresa.ticker}
                  </Link>
                </td>

                <td className="px-4 py-4 text-slate-300">
                  {empresa.setor || "-"}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                    {empresa.classificacao || "-"}
                  </span>
                </td>

                <td className="px-4 py-4">{formatarDinheiro(empresa.preco)}</td>
                <td className="px-4 py-4">{formatarNumero(empresa.pl)}</td>
                <td className="px-4 py-4">{formatarNumero(empresa.pvp)}</td>
                <td className="px-4 py-4">{formatarPercentual(empresa.roe)}</td>
                <td className="px-4 py-4">
                  {formatarPercentual(empresa.dividend_yield)}
                </td>
                <td className="px-4 py-4">
                  {formatarPercentual(empresa.margem_liquida)}
                </td>
                <td className="px-4 py-4">
                  {formatarNumero(empresa.divida_liquida_ebitda)}
                </td>
                <td className="px-4 py-4">
                  {formatarDinheiro(empresa.liquidez_2_meses)}
                </td>
                <td className="px-4 py-4 font-bold text-emerald-300">
                  {empresa.score ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
