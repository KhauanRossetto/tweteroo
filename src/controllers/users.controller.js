import User from '../models/User.js';

export async function signUp(req, res) {
  const { username, avatar } = req.body;

  if (!username || !avatar) {
    return res.status(400).send("Username e avatar são obrigatórios.");
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send("Username já cadastrado.");
    }

    const newUser = new User({ username, avatar });
    await newUser.save();

    res.status(201).send("Usuário cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    res.status(500).send("Erro ao cadastrar usuário.");
  }
}
