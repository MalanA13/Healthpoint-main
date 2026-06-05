const { predictNoShowWithModel } = require("../services/aiModelClient");

async function predictNoShowRisk(req, res) {
  res.json(await predictNoShowWithModel(req.body));
}

module.exports = {
  predictNoShowRisk,
};
