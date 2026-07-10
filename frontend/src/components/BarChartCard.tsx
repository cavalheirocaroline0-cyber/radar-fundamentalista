import type { InsightItem } from "@/lib/api";

type Props = {
  titulo: string;
  descricao: string;
  dados: InsightItem[];
};

function numero(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined) return 0;

  const convertido = Number(valor);

  if (Number.isNaN(convertido)) return 0;

  return convertido;
}

export default function BarChartCard({ titulo, descricao, dados }: Props) {
  const maiorValor = Math.max(...dados.map((item) => numero(item.valor)), 1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <h2 className="text-2xl font-bold">{titulo}</h2>
        <p className="mt-2 text-sm text-slate-400">{descricao}</p>
      </div>

      <div className="mt-6 space-y-4">
        {dados.map((item) => {
          const valor = numero(item.valor);
          const largura = Math.max((valor / maiorValor) * 100, 4);

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-bold text-sky-300">{valor}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-400"
                  style={{ width: `${largura}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
