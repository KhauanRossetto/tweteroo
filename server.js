import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/db.js";

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Falha ao conectar no MongoDB:", err);
    process.exit(1);
  });
