function riskLabel(probability) {
  if (probability >= 0.65) return "High";
  if (probability >= 0.35) return "Medium";
  return "Low";
}

function recommendation(label) {
  if (label === "High") {
    return "Kirim reminder tambahan dan tawarkan konfirmasi ulang jadwal.";
  }
  if (label === "Medium") {
    return "Kirim reminder standar satu hari sebelum appointment.";
  }
  return "Risiko rendah, reminder standar sudah cukup.";
}

function predictNoShow(payload) {
  const waitingDays = Number(payload.waiting_days ?? payload.waitingDays ?? 0);
  const age = Number(payload.age ?? 30);
  const smsReceived = Number(payload.sms_received ?? payload.smsReceived ?? 0);
  const chronic = Number(payload.has_chronic_condition ?? payload.hasChronicCondition ?? 0);

  let score = 0.18;
  if (waitingDays > 7) score += 0.12;
  if (waitingDays > 14) score += 0.11;
  if (waitingDays > 30) score += 0.08;
  if (age >= 13 && age <= 35) score += 0.08;
  if (smsReceived === 0) score += 0.07;
  if (chronic === 1) score -= 0.04;

  const probability = Math.max(0.03, Math.min(score, 0.92));
  const label = riskLabel(probability);

  return {
    no_show_probability: Number(probability.toFixed(4)),
    risk_level: label,
    recommendation: recommendation(label),
    note: "Heuristic fallback. Replace with TensorFlow inference service after model export.",
  };
}

module.exports = { predictNoShow };
