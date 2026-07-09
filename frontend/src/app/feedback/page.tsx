import Header from "@/components/Header";
import FeedbackForm from "@/components/FeedbackForm";

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Avaliação
        </p>

        <h1 className="mt-4 text-4xl font-bold md:text-5xl">
          Avalie o Radar Fundamentalista
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          Sua opinião ajuda a decidir as próximas funcionalidades: tabela
          comparativa, análises por empresa, IA, alertas, watchlist e versão
          premium.
        </p>

        <FeedbackForm />
      </section>
    </main>
  );
}
