import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true, // Adiciona um comportamento para remover espaços em branco extras
  },
  tweet: {
    type: String,
    required: true,
    maxlength: 280, // Limite de caracteres do tweet
    trim: true, // Remove espaços em branco extras
  },
}, {
  timestamps: true, // Adiciona automaticamente createdAt e updatedAt
});


export default mongoose.model('Tweet', tweetSchema);
