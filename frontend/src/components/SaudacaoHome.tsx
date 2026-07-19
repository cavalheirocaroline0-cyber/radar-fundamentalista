"use client";

import { useEffect, useState } from "react";

type Props = {
  saudacao: string;
};

export default function SaudacaoHome({ saudacao }: Props) {
  const [nome, setNome] = useState("");

  useEffect(() => {
    try {
      const usuarioSalvo = localStorage.getItem("dash_usuario");
      if (!usuarioSalvo) return;

      const usuario = JSON.parse(usuarioSalvo);
      const primeiroNome = String(usuario?.nome || "").trim().split(" ")[0];

      if (primeiroNome) {
        setNome(primeiroNome);
      }
    } catch {
      setNome("");
    }
  }, []);

  return (
    <div className="mt-4 max-w-4xl">
      <h1 className="text-5xl font-black tracking-tight md:text-6xl">
        {saudacao}
        {nome ? `, ${nome}` : ""}.
      </h1>

      <p className="mt-4 max-w-2xl text-2xl font-black leading-tight text-sky-200 md:text-3xl">
        Aprenda a ler o mercado com a IA do Dash.
      </p>
    </div>
  );
}
