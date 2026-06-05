const { getCollection, updateCollection } = require("../data/store");

function findByEmail(email) {
  return getCollection("users").find((user) => user.email === email);
}

function createUser({ name, email, password }) {
  const users = getCollection("users");
  const user = {
    id: `user-${users.length + 1}`,
    name,
    email,
    password,
    role: "user",
  };
  updateCollection("users", (current) => [...current, user]);
  return user;
}

module.exports = {
  createUser,
  findByEmail,
};
