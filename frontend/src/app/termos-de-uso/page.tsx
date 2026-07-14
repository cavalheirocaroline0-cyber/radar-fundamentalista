import Header from "@/components/Header";

export const metadata = {
  title: "Termos de Uso | Dash Diário",
  description: "Termos de Uso da plataforma Dash Diário.",
};

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
          Termos de Uso
        </div>

        <h1 className="mt-6 text-4xl font-black md:text-6xl">
          Condições de utilização da plataforma
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Ao utilizar o Dash Diário, o usuário declara estar de acordo com os
          presentes Termos de Uso e com a Política de Privacidade da plataforma.
        </p>

        <div className="mt-12 space-y-8">

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">1. Objetivo</h2>

            <p className="mt-4 leading-7 text-slate-300">
              O Dash Diário oferece informações, indicadores e rankings do
              mercado financeiro para fins exclusivamente educacionais e
              informativos.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">2. Cadastro</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Algumas funcionalidades exigem a criação de uma conta. O usuário
              é responsável pela veracidade das informações fornecidas e pela
              confidencialidade de suas credenciais de acesso.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">3. Uso adequado</h2>

            <p className="mt-4 leading-7 text-slate-300">
              É proibida a utilização da plataforma para atividades ilegais,
              tentativas de invasão, engenharia reversa, cópia não autorizada
              de conteúdo ou qualquer prática que prejudique outros usuários.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">4. Propriedade intelectual</h2>

            <p className="mt-4 leading-7 text-slate-300">
              O nome Dash Diário, sua identidade visual, layout, códigos,
              funcionalidades e conteúdos desenvolvidos pertencem aos seus
              respectivos titulares e são protegidos pela legislação aplicável.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">5. Disponibilidade</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Buscamos manter a plataforma disponível continuamente, porém não
              garantimos funcionamento ininterrupto, podendo ocorrer
              manutenções, atualizações ou indisponibilidades temporárias.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-bold">6. Alterações</h2>

            <p className="mt-4 leading-7 text-slate-300">
              Estes Termos poderão ser alterados para refletir melhorias no
              produto, mudanças operacionais ou adequações legais.
            </p>
          </article>

        </div>
      </section>
    </main>
  );
}
