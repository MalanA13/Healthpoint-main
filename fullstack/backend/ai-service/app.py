import os
from pathlib import Path
import sys

from flask import Flask, jsonify, request


ROOT = Path(__file__).resolve().parents[3]
MODEL_DIR = ROOT / "ai engineer" / "model"
sys.path.append(str(MODEL_DIR))

# pyrefly: ignore [missing-import]
from inference import predict_no_show  # noqa: E402


app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "healpoint-ai-service"})


@app.post("/predict")
def predict():
    payload = request.get_json(force=True)
    return jsonify(predict_no_show(payload))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port)
