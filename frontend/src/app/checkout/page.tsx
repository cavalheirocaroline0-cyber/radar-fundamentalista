import Link from "next/link";
import Header from "@/components/Header";

const checkoutUrl = process.env.NEXT_PUBLIC_ASAAS_PREMIUM_CHECKOUT_URL || "";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-[2rem] border border-sky-400/20 bg-white/[0.04] p-6 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
            Plano Premium
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Ative a IA do Dash Diário.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Comece com 7 dias grátis. Depois, sua assinatura será de
            <strong className="text-sky-200"> R$ 4,90 por semana</strong>.
            A IA é um recurso educativo para entender indicadores, empresas,
            rankings e cenário de mercado.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-[1fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <h2 className="text-2xl font-black">
                O que está incluído
              </h2>

              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                <p>✅ Todos os recursos atuais do Dash</p>
                <p>✅ IA para explicar indicadores fundamentalistas</p>
                <p>✅ Perguntas sobre empresas, ranking e mercado</p>
                <p>✅ Ajuda para transformar dados em rotina de estudo</p>
                <p>✅ Primeira semana gratuita</p>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                O Dash Diário é educativo e informativo. A IA não recomenda compra,
                venda ou manutenção de ativos.
              </div>
            </div>

            <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
              <p className="text-sm text-slate-300">
                Assinatura semanal
              </p>

              <p className="mt-2 text-5xl font-black text-white">
                R$ 4,90
              </p>

              <p className="mt-1 text-sm text-slate-400">
                por semana, após 7 dias grátis
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p>1. Escolha o Premium</p>
                <p>2. Informe seus dados no ambiente seguro</p>
                <p>3. Ative a IA no seu perfil</p>
              </div>

              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  className="mt-8 inline-flex w-full justify-center rounded-full bg-sky-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-sky-300"
                >
                  Ir para pagamento seguro
                </a>
              ) : (
                <Link
                  href="/premium/interesse"
                  className="mt-8 inline-flex w-full justify-center rounded-full bg-sky-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-sky-300"
                >
                  Entrar na lista Premium
                </Link>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Os dados sensíveis de pagamento serão tratados pelo checkout seguro.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
