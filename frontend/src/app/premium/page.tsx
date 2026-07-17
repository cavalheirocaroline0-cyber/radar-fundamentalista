"use client";

import { useState } from "react";
import Link from "next/link";

export default function PremiumPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function enviarInteresse() {
    setCarregando(true);
    setErro("");
    setSucesso("");

    try {
      const resposta = await fetch("/api/premium/interesse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          whatsapp
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.detail || dados.erro || "Não foi possível salvar seu interesse.");
        return;
      }

      setSucesso("Pronto! Você entrou na lista premium do Dash Diário.");
      setNome("");
      setEmail("");
      setWhatsapp("");
    } catch {
      setErro("Erro de conexão. Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-28 pt-8 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-sky-300 hover:text-sky-200">
          ← Voltar para o início
        </Link>

        <div className="mt-6 rounded-3xl border border-sky-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-6 shadow-2xl shadow-sky-950/30">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
            Lista premium
          </p>

          <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">
            🧠 Entre na lista premium do Dash Diário
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            Seja avisado quando a assinatura de R$ 19,90/mês estiver disponível
            e tenha prioridade para liberar a IA educativa do Dash Diário.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
            A IA do Dash Diário terá finalidade educativa e informativa. Ela não
            realiza recomendação de investimento, consultoria financeira ou
            indicação de compra e venda de ativos.
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-200">
                Nome
              </label>
              <input
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Seu nome"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-200">
                E-mail
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seuemail@exemplo.com"
                type="email"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-200">
                WhatsApp
              </label>
              <input
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="(51) 99999-9999"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400"
              />
            </div>

            <button
              type="button"
              onClick={enviarInteresse}
              disabled={carregando}
              className="mt-2 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Enviando..." : "Entrar na lista premium"}
            </button>

            {erro && (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                {sucesso}
              </div>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Ao enviar seus dados, você autoriza o contato do Dash Diário sobre a
            liberação da assinatura premium. Seus dados não serão usados para
            recomendação de investimento.
          </p>
        </div>
      </section>
    </main>
  );
}
