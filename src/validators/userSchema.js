import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().required().min(3).max(50).messages({
      'string.min': 'O username deve ter pelo menos 3 caracteres.',
      'string.max': 'O username não pode ter mais de 50 caracteres.',
      'any.required': 'O username é obrigatório.'
    }),
    avatar: Joi.string().uri().required().messages({
      'string.uri': 'O avatar deve ser uma URL válida.',
      'any.required': 'O avatar é obrigatório.'
    })
  });