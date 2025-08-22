import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import User from "./models/User.js";
import Tweet from "./models/Tweet.js";

import Joi from "joi";
import { userSchema } from "./validators/userSchema.js";
import { tweetSchema } from "./validators/tweetSchema.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------------- Schemas/Middlewares ------------------------- */
const idParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "O ID deve ser um valor hexadecimal válido.",
    "string.length": "O ID deve ter 24 caracteres.",
    "any.required": "O ID é obrigatório."
  })
});

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(422).json({
      message: "Dados inválidos",
      errors: error.details.map((d) => d.message)
    });
  }
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, { abortEarly: false });
  if (error) {
    return res.status(422).json({
      message: "Parâmetros inválidos",
      errors: error.details.map((d) => d.message)
    });
  }
  next();
};

/* ------------------------------ Rotas --------------------------------- */
app.get("/", (_req, res) => {
  res.send("Tweteroo API rodando!");
});

app.post("/sign-up", validateBody(userSchema), async (req, res) => {
  const { username, avatar } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "Este username já está em uso." });
    await User.create({ username, avatar: avatar || "" });
    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro no /sign-up:", error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

app.post("/tweets", validateBody(tweetSchema), async (req, res) => {
  const { username, tweet } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Usuário não autorizado. Faça o cadastro primeiro." });
    await Tweet.create({ username, tweet });
    return res.status(201).json({ message: "Tweet criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar tweet:", error);
    return res.status(500).json({ message: "Erro ao criar tweet." });
  }
});

app.get("/tweets/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
    const tweets = await Tweet.find({ username }).sort({ createdAt: -1 });
    const payload = tweets.map((t) => ({
      _id: t._id,
      username: t.username,
      avatar: user.avatar || "",
      tweet: t.tweet
    }));
    return res.status(200).json(payload);
  } catch (error) {
    console.error("Erro ao buscar tweets do usuário:", error);
    return res.status(500).json({ message: "Erro ao buscar tweets." });
  }
});

app.get("/tweets", async (_req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 });
    const enriched = await Promise.all(
      tweets.map(async (t) => {
        const u = await User.findOne({ username: t.username });
        return { _id: t._id, username: t.username, avatar: u?.avatar || "", tweet: t.tweet };
      })
    );
    return res.status(200).json(enriched);
  } catch (error) {
    console.error("Erro ao buscar tweets:", error);
    return res.status(500).json({ message: "Erro ao buscar tweets." });
  }
});

app.put("/tweets/:id", validateParams(idParamsSchema), async (req, res) => {
  const { id } = req.params;
  const { tweet } = req.body;
  const { error } = Joi.object({ tweet: tweetSchema.extract("tweet") }).validate({ tweet }, { abortEarly: false });
  if (error) {
    return res.status(422).json({ message: "Dados inválidos", errors: error.details.map((d) => d.message) });
  }
  try {
    const updated = await Tweet.findByIdAndUpdate(id, { tweet }, { new: true });
    if (!updated) return res.status(404).json({ message: "Tweet não encontrado" });
    return res.sendStatus(204);
  } catch (err) {
    console.error("Erro ao editar tweet:", err);
    return res.status(500).json({ message: "Erro ao editar tweet" });
  }
});

app.delete("/tweets/:id", validateParams(idParamsSchema), async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Tweet.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Tweet não encontrado" });
    return res.sendStatus(204);
  } catch (error) {
    console.error("Erro ao deletar tweet:", error);
    return res.status(500).json({ message: "Erro ao deletar tweet" });
  }
});

app.get("/users", async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});

/* --------- EXPORTA O APP (sem listen aqui!) --------- */
export default app;
