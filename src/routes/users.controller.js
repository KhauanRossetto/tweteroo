export function signUp(req, res) {
  const { username, avatar } = req.body;

  if (!username || !avatar) {
    return res.status(400).send("username e avatar são obrigatórios.");
  }

  // Aqui você pode salvar no banco depois
  console.log({ username, avatar });

  res.status(201).send("Usuário cadastrado com sucesso!");
}
