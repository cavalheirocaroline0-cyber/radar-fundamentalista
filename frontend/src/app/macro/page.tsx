import Header from "@/components/Header";

const indicadores = [
  { nome: "Selic", valor: "15,00%", descricao: "Taxa básica de juros" },
  { nome: "IPCA", valor: "4,23%", descricao: "Inflação acumulada" },
  { nome: "Dólar", valor: "R$ 5,45", descricao: "Câmbio comercial" },
  { nome: "Bitcoin", valor: "R$ 580 mil", descricao: "Criptoativo monitorado" },
  { nome: "Ouro", valor: "R$ 620", descricao: "Grama em reais" },
  { nome: "Prata", valor: "R$ 6,80", descricao: "Grama em reais" },
];

export default function MacroPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Macro
        </p>
        <h1 className="mt-4 text-4xl font-bold">Indicadores macroeconômicos</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Painel com juros, inflação, câmbio, criptoativos e metais monitorados.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {indicadores.map((item) => (
            <div key={item.nome} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">{item.nome}</p>
              <p className="mt-2 text-4xl font-bold">{item.valor}</p>
              <p className="mt-2 text-sm text-slate-400">{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
