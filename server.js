import dotenv from "dotenv";
import app from "./src/app.js";
import Tweet from './models/Tweet.js';


dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
