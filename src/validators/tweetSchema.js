import Joi from "joi";

export const tweetSchema = Joi.object({
    username: Joi.string().required().min(3).max(50).messages({
      'string.min': 'O username deve ter pelo menos 3 caracteres.',
      'string.max': 'O username não pode ter mais de 50 caracteres.',
      'any.required': 'O username é obrigatório.'
    }),
    tweet: Joi.string().required().min(1).max(280).messages({
      'string.min': 'O tweet não pode estar vazio.',
      'string.max': 'O tweet não pode ter mais de 280 caracteres.',
      'any.required': 'O tweet é obrigatório.'
    })
  });