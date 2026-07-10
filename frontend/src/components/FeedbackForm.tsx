"use client";

import { useState } from "react";
import { enviarFeedback } from "@/lib/formsApi";

export default function FeedbackForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nota, setNota] = useState(10);
  const [facilidade, setFacilidade] = useState("Fácil");
  const [utilidade, setUtilidade] = useState("Muito útil");
  const [pagaria, setPagaria] = useState("Talvez");
  const [valorSugerido, setValorSugerido] = useState("");
  const [comentario, setComentario] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "sucesso" | "erro">("idle");

  async function handleSubmit(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setStatus("enviando");

    try {
      await enviarFeedback({
        nome,
        email,
        nota,
        facilidade,
        utilidade,
        pagaria,
        valor_sugerido: valorSugerido,
        comentario,
      });

      setStatus("sucesso");
      setNome("");
      setEmail("");
      setNota(10);
      setFacilidade("Fácil");
      setUtilidade("Muito útil");
      setPagaria("Talvez");
      setValorSugerido("");
      setComentario("");
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
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="seuemail@email.com"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">Nota de 0 a 10</label>
          <input
            value={nota}
            onChange={(e) => setNota(Number(e.target.value))}
            type="number"
            min={0}
            max={10}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">Navegação</label>
          <select
            value={facilidade}
            onChange={(e) => setFacilidade(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          >
            <option>Muito fácil</option>
            <option>Fácil</option>
            <option>Confusa</option>
            <option>Difícil</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400">Utilidade</label>
          <select
            value={utilidade}
            onChange={(e) => setUtilidade(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          >
            <option>Muito útil</option>
            <option>Útil</option>
            <option>Pouco útil</option>
            <option>Não entendi o objetivo</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400">Você pagaria por uma versão completa?</label>
          <select
            value={pagaria}
            onChange={(e) => setPagaria(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          >
            <option>Sim</option>
            <option>Talvez</option>
            <option>Não</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm text-slate-400">Quanto você pagaria por mês?</label>
        <input
          value={valorSugerido}
          onChange={(e) => setValorSugerido(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          placeholder="Ex: R$ 9,90, R$ 19,90, R$ 29,90..."
        />
      </div>

      <div className="mt-5">
        <label className="text-sm text-slate-400">Comentário, sugestão ou crítica</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={5}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
          placeholder="O que você gostou? O que ficou confuso? O que gostaria de ver?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "enviando"}
        className="mt-6 rounded-full bg-sky-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
      >
        {status === "enviando" ? "Enviando..." : "Enviar avaliação"}
      </button>

      {status === "sucesso" && (
        <p className="mt-4 text-sm font-semibold text-sky-300">
          Feedback recebido com sucesso. Obrigada por ajudar a evoluir o Dash!
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
