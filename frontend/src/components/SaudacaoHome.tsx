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
    <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight md:text-6xl">
      {saudacao}
      {nome ? `, ${nome}` : ""}.{" "}
      <span className="text-sky-200">
        Aprenda a ler o mercado com a IA do Dash.
      </span>
    </h1>
  );
}
