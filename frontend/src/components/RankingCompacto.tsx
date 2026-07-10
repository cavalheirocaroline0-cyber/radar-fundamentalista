import Link from "next/link";
import type { InsightEmpresa } from "@/lib/api";

type Props = {
  titulo: string;
  descricao: string;
  empresas: InsightEmpresa[];
  metrica: "score" | "roe" | "dividend_yield";
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

function formatarMetrica(valor: number | string | null | undefined, metrica: Props["metrica"]) {
  if (metrica === "score") return valor ?? "-";
  return `${formatarNumero(valor)}%`;
}

export default function RankingCompacto({
  titulo,
  descricao,
  empresas,
  metrica,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-bold">{titulo}</h2>
      <p className="mt-2 text-sm text-slate-400">{descricao}</p>

      <div className="mt-6 space-y-3">
        {empresas.map((empresa, index) => (
          <div
            key={`${empresa.ticker}-${index}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 text-sm font-bold text-sky-300">
                {index + 1}
              </div>

              <div>
                <Link
                  href={`/empresa/${empresa.ticker}`}
                  className="font-bold text-sky-300 hover:underline"
                >
                  {empresa.ticker}
                </Link>

                <p className="mt-1 text-xs text-slate-500">
                  {empresa.setor || "Setor a classificar"} ·{" "}
                  {empresa.classificacao || "-"}
                </p>
              </div>
            </div>

            <p className="text-lg font-bold text-white">
              {formatarMetrica(empresa[metrica], metrica)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
