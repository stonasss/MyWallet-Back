import joi from "joi";

export const walletSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
});
