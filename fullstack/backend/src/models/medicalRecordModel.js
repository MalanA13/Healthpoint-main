const { getCollection, updateCollection } = require("../data/store");

function findAll() {
  return getCollection("medicalRecords");
}

function findById(id) {
  return findAll().find((record) => record.id === id);
}

function findByUserId(userId) {
  return findAll().filter((record) => record.userId === userId);
}

function create(record) {
  updateCollection("medicalRecords", (current) => [record, ...current]);
  return record;
}

function update(id, payload) {
  const current = findById(id);
  if (!current) return null;
  const updated = { ...current, ...payload, id: current.id, userId: payload.userId || current.userId };
  updateCollection("medicalRecords", (items) => items.map((item) => (item.id === id ? updated : item)));
  return updated;
}

function remove(id) {
  const current = findById(id);
  if (!current) return null;
  updateCollection("medicalRecords", (items) => items.filter((item) => item.id !== id));
  return current;
}

module.exports = {
  create,
  findAll,
  findById,
  findByUserId,
  remove,
  update,
};
