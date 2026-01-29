// services/geminiService.ts (FRONTEND ONLY)

export const getAIRecommendations = async (query: string) => {
  const res = await fetch("http://localhost:5000/api/ai-counsellor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  return res.json();
};
