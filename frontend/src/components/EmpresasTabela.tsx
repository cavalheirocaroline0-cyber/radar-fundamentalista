"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Empresa } from "@/lib/api";

type Props = {
  empresas: Empresa[];
};

function formatarNumero(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined) return "-";

  const numero = Number(valor);

  if (Number.isNaN(numero)) return "-";

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarPercentual(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined) return "-";
  return `${formatarNumero(valor)}%`;
}

export default function EmpresasTabela({ empresas }: Props) {
  const [busca, setBusca] = useState("");
  const [classificacao, setClassificacao] = useState("Todas");

  const classificacoes = useMemo(() => {
    const lista = empresas
      .map((empresa) => empresa.classificacao)
      .filter((item): item is string => Boolean(item));

    return ["Todas", ...Array.from(new Set(lista)).sort()];
  }, [empresas]);

  const empresasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return empresas.filter((empresa) => {
      const textoBusca = [
        empresa.ticker,
        empresa.empresa,
        empresa.setor,
        empresa.classificacao,
      ]
        .join(" ")
        .toLowerCase();

      const bateBusca = termo === "" || textoBusca.includes(termo);

      const bateClassificacao =
        classificacao === "Todas" || empresa.classificacao === classificacao;

      return bateBusca && bateClassificacao;
    });
  }, [busca, classificacao, empresas]);

  return (
    <>
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="text-sm text-slate-400">Buscar empresa</label>
            <input
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Digite PETR4, Itaú, Banco, Oportunidade..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Classificação</label>
            <select
              value={classificacao}
              onChange={(evento) => setClassificacao(evento.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-400 lg:w-56"
            >
              {classificacoes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Mostrando {empresasFiltradas.length} de {empresas.length} empresas.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
        <table className="w-full min-w-[1000px] text-left text-sm">
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
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>

          <tbody>
            {empresasFiltradas.map((empresa) => (
              <tr key={empresa.ticker} className="border-t border-white/10">
                <td className="px-4 py-4 font-bold text-sky-300">
                  <Link
                    href={`/empresa/${empresa.ticker}`}
                    className="transition hover:text-sky-100 hover:underline"
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

                <td className="px-4 py-4">
                  R$ {formatarNumero(empresa.preco)}
                </td>

                <td className="px-4 py-4">{formatarNumero(empresa.pl)}</td>

                <td className="px-4 py-4">{formatarNumero(empresa.pvp)}</td>

                <td className="px-4 py-4">
                  {formatarPercentual(empresa.roe)}
                </td>

                <td className="px-4 py-4">
                  {formatarPercentual(empresa.dividend_yield)}
                </td>

                <td className="px-4 py-4 font-bold text-sky-300">
                  {empresa.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
