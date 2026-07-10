"use client";

import { useState } from "react";
import { enviarCadastroBeta } from "@/lib/formsApi";

export default function BetaForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("Iniciante");
  const [investeHoje, setInvesteHoje] = useState("Sim");
  const [interesse, setInteresse] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "sucesso" | "erro">("idle");

  async function handleSubmit(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setStatus("enviando");

    try {
      await enviarCadastroBeta({
        nome,
        email,
        perfil,
        investe_hoje: investeHoje,
        interesse,
      });

      setStatus("sucesso");
      setNome("");
      setEmail("");
      setPerfil("Iniciante");
      setInvesteHoje("Sim");
      setInteresse("");
    } catch {
      setStatus("erro");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="seuemail@email.com"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">Perfil de investidor</label>
          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          >
            <option>Iniciante</option>
            <option>Intermediário</option>
            <option>Avançado</option>
            <option>Profissional do mercado</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400">Você investe hoje?</label>
          <select
            value={investeHoje}
            onChange={(e) => setInvesteHoje(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          >
            <option>Sim</option>
            <option>Não</option>
            <option>Estou começando</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm text-slate-400">O que você gostaria de acompanhar no Dash?</label>
        <textarea
          value={interesse}
          onChange={(e) => setInteresse(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          placeholder="Ex: ações baratas, dividendos, ranking, IA, alertas..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "enviando"}
        className="mt-6 rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
      >
        {status === "enviando" ? "Enviando..." : "Entrar na lista beta"}
      </button>

      {status === "sucesso" && (
        <p className="mt-4 text-sm font-semibold text-sky-300">
          Cadastro recebido com sucesso. Obrigada por testar o Dash!
        </p>
      )}

      {status === "erro" && (
        <p className="mt-4 text-sm font-semibold text-red-300">
          Não foi possível enviar agora. Tente novamente em instantes.
        </p>
      )}
    </form>
  );
}
