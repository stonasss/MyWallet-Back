export function validateSchema(schema) {
    return (req, res, next) => {
        const invalid = schema.validate(req.body, { abortEarly: false });

        if (invalid.error) {
            res.status(422).send(invalid.error.details);
            return
        }
        next()
    }
}