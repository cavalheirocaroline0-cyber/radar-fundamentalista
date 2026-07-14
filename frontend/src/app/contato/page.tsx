import Header from "@/components/Header";

export const metadata = {
  title: "Contato | Dash Diário",
  description:
    "Entre em contato com o Dash Diário para dúvidas, sugestões, suporte e solicitações sobre seus dados.",
};

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
          Contato
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
          Fale com o Dash Diário
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Use este canal para enviar dúvidas, sugestões, relatos de erro,
          solicitações sobre seus dados ou assuntos relacionados ao produto.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Atendimento
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Entre em contato por e-mail
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Para suporte, sugestões, questões relacionadas à conta ou
              solicitações de privacidade, envie uma mensagem para:
            </p>

            <a
              href="mailto:contato@dashdiario.com.br"
              className="mt-6 inline-flex rounded-full bg-sky-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-sky-300"
            >
              contato@dashdiario.com.br
            </a>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Privacidade e LGPD
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Solicitações sobre dados pessoais
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Você pode solicitar acesso, correção, exclusão ou informações
              sobre o tratamento dos seus dados pessoais pelo mesmo canal de
              atendimento.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Para facilitar a identificação, informe no assunto:
              <strong className="text-slate-300"> Solicitação LGPD</strong>.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-7">
          <h2 className="text-2xl font-bold">Tempo de resposta</h2>

          <p className="mt-4 leading-7 text-slate-300">
            As mensagens serão analisadas assim que possível. Solicitações
            relacionadas a dados pessoais serão tratadas de acordo com a
            legislação aplicável e com os prazos necessários para verificação
            da identidade e execução do pedido.
          </p>
        </div>
      </section>
    </main>
  );
}
