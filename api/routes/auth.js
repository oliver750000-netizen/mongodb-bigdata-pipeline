const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
require("dotenv").config();

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son obligatorios" });
    }

    const db = getDB();
    const users = db.collection("users");

    const existe = await users.findOne({ username });
    if (existe) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      userId: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son obligatorios" });
    }

    const db = getDB();
    const users = db.collection("users");

    const user = await users.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;