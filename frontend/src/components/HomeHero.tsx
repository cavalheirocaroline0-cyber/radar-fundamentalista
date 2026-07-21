import Link from "next/link";
import SaudacaoHome from "@/components/SaudacaoHome";

type Props = {
  saudacao: string;
  dataHoje: string;
  resumoMercado: string;
  erro: boolean;
  empresas: unknown[];
  ranking: unknown[];
  indicadores: unknown[];
  ativos: unknown[];
};

export default function HomeHero({
  saudacao,
  dataHoje,
  resumoMercado,
  erro,
  empresas,
  ranking,
  indicadores,
  ativos,
}: Props) {
  const totalMacro = indicadores.length + ativos.length;

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute right-10 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
            🌟 Todo dia começa com o Dash
          </div>

          <SaudacaoHome saudacao={saudacao} />

          <p className="mt-5 text-sm font-bold lowercase tracking-[0.25em] text-slate-500">
            {dataHoje}
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {resumoMercado} A IA do Dash transforma dados, empresas e indicadores
            em uma leitura simples para você criar uma rotina melhor com o mercado.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ia?pergunta=Oi%20Dash%2C%20como%20est%C3%A1%20o%20mercado%20hoje%3F"
              className="rounded-full bg-sky-400 px-6 py-3 font-black text-slate-950 transition hover:bg-sky-300"
            >
              Perguntar ao Dash
            </Link>

            <Link
              href="/empresas"
              className="rounded-full border border-white/20 px-6 py-3 font-bold text-white transition hover:border-sky-400 hover:text-sky-300"
            >
              Explorar empresas
            </Link>

            <Link
              href="/ranking"
              className="rounded-full border border-white/20 px-6 py-3 font-bold text-white transition hover:border-sky-400 hover:text-sky-300"
            >
              Ver ranking
            </Link>
          </div>
</div>

        <div className="relative">
          <div className="rounded-[2.2rem] border border-sky-400/20 bg-slate-950/80 p-5 shadow-2xl shadow-sky-950/40 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
                  IA do Dash
                </p>

                <h2 className="mt-3 text-3xl font-black leading-tight text-white">
                  Uma leitura inteligente do seu dia.
                </h2>
              </div>

              <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-200">
                online
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="ml-auto max-w-[88%] rounded-3xl rounded-tr-md border border-sky-400/20 bg-sky-400/15 p-4">
                <p className="text-sm font-semibold text-sky-100">
                  Oi Dash, como está o mercado hoje?
                </p>
              </div>

              <div className="max-w-[92%] rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  resposta do dash
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Hoje eu começo pelo cenário geral, depois olho empresas,
                  rankings e indicadores. Se quiser, eu traduzo tudo em linguagem simples.
                </p>
              </div>
            </div>

            <Link
              href="/ia?pergunta=Oi%20Dash%2C%20como%20est%C3%A1%20o%20mercado%20hoje%3F"
              className="mt-6 inline-flex w-full justify-center rounded-full bg-sky-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-sky-300"
            >
              Abrir conversa com a IA
            </Link>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                Base do Dash
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[11px] text-slate-500">Empresas</p>
                  <p className="mt-1 text-2xl font-black text-sky-300">
                    {erro ? "-" : empresas.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[11px] text-slate-500">Ranking</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {erro ? "-" : ranking.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[11px] text-slate-500">Macro</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {erro ? "-" : totalMacro}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-5 -right-5 hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 text-xs text-slate-400 backdrop-blur md:block">
            hábito diário + dados + IA
          </div>
        </div>
      </div>

      {erro && (
        <div className="relative mx-auto max-w-7xl px-6 pb-10">
          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <h2 className="text-2xl font-bold text-red-300">
              Não foi possível carregar os dados reais
            </h2>
            <p className="mt-3 text-slate-300">
              Confirme se o backend está rodando e se a API está disponível.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
