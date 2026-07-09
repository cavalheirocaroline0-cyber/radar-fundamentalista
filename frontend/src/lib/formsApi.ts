const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type CadastroBetaPayload = {
  nome: string;
  email: string;
  perfil: string;
  investe_hoje: string;
  interesse: string;
};

export type FeedbackPayload = {
  nome: string;
  email: string;
  nota: number;
  facilidade: string;
  utilidade: string;
  pagaria: string;
  valor_sugerido: string;
  comentario: string;
};

export async function enviarCadastroBeta(dados: CadastroBetaPayload) {
  const resposta = await fetch(`${API_URL}/beta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao enviar cadastro beta");
  }

  return resposta.json();
}

export async function enviarFeedback(dados: FeedbackPayload) {
  const resposta = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao enviar feedback");
  }

  return resposta.json();
}
