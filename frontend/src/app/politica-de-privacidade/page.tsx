import Header from "@/components/Header";

export const metadata = {
  title: "Política de Privacidade | Dash Diário",
  description: "Política de Privacidade do Dash Diário.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
          Política de Privacidade
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">
          Sua privacidade é importante
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          O Dash Diário foi desenvolvido para oferecer informações de mercado
          de forma simples, organizada e transparente, respeitando a Lei Geral
          de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
        </p>

        <div className="mt-12 space-y-8">

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">1. Dados coletados</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Podemos coletar informações fornecidas pelo próprio usuário,
              como nome, endereço de e-mail, preferências de empresas,
              watchlist e demais configurações realizadas dentro da plataforma.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">2. Como utilizamos os dados</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Os dados são utilizados exclusivamente para melhorar a
              experiência do usuário, personalizar conteúdos, permitir acesso
              às funcionalidades da plataforma e aperfeiçoar nossos serviços.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">3. Compartilhamento</h2>

            <p className="mt-4 leading-7 text-slate-300">
              O Dash Diário não comercializa dados pessoais dos usuários.
              Informações somente poderão ser compartilhadas quando exigidas
              por obrigação legal ou determinação judicial.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">4. Segurança</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Adotamos medidas técnicas e organizacionais para proteger as
              informações armazenadas contra acessos não autorizados,
              alteração, divulgação ou destruição.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">5. Direitos do usuário</h2>

            <p className="mt-4 leading-7 text-slate-300">
              O usuário poderá solicitar acesso, correção, atualização,
              anonimização ou exclusão de seus dados pessoais, conforme
              previsto na LGPD.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">6. Alterações nesta política</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Esta Política poderá ser atualizada periodicamente para refletir
              melhorias na plataforma ou alterações legais.
            </p>
          </article>

        </div>
      </section>
    </main>
  );
}
