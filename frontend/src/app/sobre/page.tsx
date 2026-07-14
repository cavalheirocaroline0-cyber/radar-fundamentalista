import Header from "@/components/Header";

export const metadata = {
  title: "Sobre | Dash Diário",
  description:
    "Conheça a missão, o propósito e a proposta de valor do Dash Diário.",
};

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
          Sobre o Dash Diário
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
          Todo dia começa com o Dash.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          O Dash Diário nasceu para transformar dados financeiros complexos em
          informações simples, organizadas e acessíveis.
        </p>

        <div className="mt-12 grid gap-6">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Nossa missão
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Criar um hábito financeiro mais saudável
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Queremos ajudar pessoas a começarem o dia entendendo o mercado,
              acompanhando empresas e tomando decisões mais conscientes por
              meio de dados confiáveis e uma experiência simples.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              O problema
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Informação demais, clareza de menos
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Investidores precisam consultar diferentes plataformas para
              acompanhar indicadores, empresas, rankings e cenário econômico.
              Isso consome tempo e dificulta a interpretação das informações.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Nossa solução
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Mercado, empresas e dados em um único lugar
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              O Dash Diário reúne informações de mercado, indicadores
              fundamentalistas, rankings e ferramentas de personalização para
              facilitar o acompanhamento diário dos investimentos.
            </p>
          </article>

          <article className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Evolução contínua
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              O Dash Diário nunca estará completamente pronto
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              O produto será aprimorado continuamente com base em dados,
              aprendizados e feedback dos usuários. Cada evolução deverá tornar
              a experiência mais útil, simples e inteligente.
            </p>
          </article>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-slate-900 p-7">
          <p className="text-sm leading-7 text-slate-400">
            O Dash Diário possui finalidade educacional e informativa. A
            plataforma não realiza recomendações personalizadas de
            investimento.
          </p>
        </div>
      </section>
    </main>
  );
}
