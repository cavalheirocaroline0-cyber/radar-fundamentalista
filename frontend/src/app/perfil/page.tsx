export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-28 pt-8 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
          Dash Diário
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Perfil e informações
        </h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          O Dash Diário é uma ferramenta de acompanhamento de empresas,
          indicadores fundamentalistas e contexto de mercado. O objetivo é
          organizar dados de forma simples, visual e acessível.
        </p>

        <div className="mt-8 grid gap-4">
          <a
            href="/feedback"
            className="rounded-3xl border border-slate-800 bg-slate-900 p-5 transition hover:border-sky-400"
          >
            <h2 className="text-lg font-semibold">Enviar feedback</h2>
            <p className="mt-2 text-sm text-slate-400">
              Compartilhe sugestões, erros encontrados ou ideias para melhorar
              o produto.
            </p>
          </a>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Aviso legal</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              O Dash Diário não realiza recomendação de investimento, consultoria
              financeira, análise individualizada ou indicação de compra e venda
              de ativos. As informações são apresentadas para fins educacionais,
              informativos e de acompanhamento.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Versão do produto</h2>
            <p className="mt-2 text-sm text-slate-400">
              MVP PWA — aplicativo instalável em desenvolvimento.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
