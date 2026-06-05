const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const secret = process.env.JWT_SECRET || "healpoint-dev-secret";

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
  };
}

function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "valid email is required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "password must be at least 8 characters" });
  }

  const exists = userModel.findByEmail(email);
  if (exists) {
    return res.status(409).json({ message: "email already registered" });
  }

  const user = userModel.createUser({ name, email, password: bcrypt.hashSync(password, 10) });
  return res.status(201).json(publicUser(user));
}

function login(req, res) {
  const { email, password } = req.body;
  const user = userModel.findByEmail(email);
  const passwordMatches =
    user && (user.password?.startsWith("$2") ? bcrypt.compareSync(password, user.password) : user.password === password);
  if (!user || !passwordMatches) {
    return res.status(401).json({ message: "invalid email or password" });
  }

  const safeUser = publicUser(user);
  const token = jwt.sign({ sub: safeUser.id, email: safeUser.email, role: safeUser.role }, secret, {
    expiresIn: "2h",
  });
  return res.json({ token, user: safeUser });
}

module.exports = {
  login,
  register,
};
