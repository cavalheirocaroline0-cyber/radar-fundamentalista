import Header from "@/components/Header";
import BetaForm from "@/components/BetaForm";

export default function BetaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
          Beta
        </p>

        <h1 className="mt-4 text-4xl font-bold md:text-5xl">
          Entre na lista beta do Dash
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          Estamos testando a primeira versão pública do Dash Diário.
          Deixe seus dados para acompanhar a evolução do produto e ajudar a
          construir uma plataforma mais útil para investidores.
        </p>

        <BetaForm />
      </section>
    </main>
  );
}
