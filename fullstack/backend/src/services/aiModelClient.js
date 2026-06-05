const { predictNoShow } = require("./riskPredictor");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:5000";

function delocalizeNeighbourhood(name) {
  if (!name) return "Jardim Da Penha";
  const mapping = {
    "Dago": "Jardim Da Penha",
    "Cihampelas": "Maria Ortiz",
    "Pasteur": "Santo Antonio",
    "Antapani": "Resistência",
    "Cibaduyut": "Vila Rubim",
    "Sukajadi": "São Cristóvão",
    "Ciumbuleuit": "Maruípe",
    "Gedebage": "Santa Cecília",
    "Ujungberung": "Tabuazeiro",
  };
  return mapping[name] || name;
}

async function predictNoShowWithModel(payload) {
  try {
    const modelPayload = { ...payload };
    if (modelPayload.neighbourhood) {
      modelPayload.neighbourhood = delocalizeNeighbourhood(modelPayload.neighbourhood);
    }

    const response = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modelPayload),
    });

    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }

    return {
      ...(await response.json()),
      source: "tensorflow-model",
    };
  } catch (error) {
    return {
      ...predictNoShow(payload),
      source: "heuristic-fallback",
      warning: "AI service unavailable, fallback used",
    };
  }
}

module.exports = {
  predictNoShowWithModel,
};
