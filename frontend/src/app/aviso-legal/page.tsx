import Header from "@/components/Header";

export const metadata = {
  title: "Aviso Legal | Dash Diário",
  description:
    "Aviso Legal do Dash Diário sobre o uso das informações disponibilizadas na plataforma.",
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-16">

        <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
          Aviso Legal
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">
          Transparência em primeiro lugar
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          O Dash Diário foi criado para facilitar o acompanhamento do mercado
          financeiro por meio de dashboards, indicadores e análises
          automatizadas.
        </p>

        <div className="mt-12 space-y-8">

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">
              Finalidade exclusivamente educacional
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Todo o conteúdo disponibilizado possui caráter exclusivamente
              educacional, informativo e de apoio ao estudo do mercado
              financeiro.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">
              Não constitui recomendação de investimento
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Nenhuma informação apresentada deve ser interpretada como
              recomendação personalizada de compra, venda ou manutenção de
              ativos financeiros.
            </p>

            <p className="mt-4 leading-7 text-slate-300">
              Toda decisão de investimento deve considerar o perfil do
              investidor, seus objetivos, tolerância ao risco e, quando
              necessário, orientação de profissionais habilitados.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">
              Fontes de dados
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Os indicadores apresentados são obtidos a partir de bases públicas
              e provedores externos. Embora exista cuidado na coleta e
              atualização das informações, podem ocorrer atrasos,
              indisponibilidades ou divergências entre diferentes fontes.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">
              Limitação de responsabilidade
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              O Dash Diário não se responsabiliza por perdas financeiras,
              decisões de investimento ou quaisquer danos decorrentes da
              utilização das informações disponibilizadas na plataforma.
            </p>
          </article>

          <article className="rounded-3xl border border-sky-400/20 bg-sky-400/5 p-7">
            <h2 className="text-2xl font-bold text-sky-300">
              Nossa missão
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              A missão do Dash Diário é democratizar o acesso à informação,
              incentivar a educação financeira e ajudar investidores a
              compreenderem melhor os dados do mercado por meio de uma
              experiência simples, organizada e intuitiva.
            </p>
          </article>

        </div>

      </section>
    </main>
  );
}
