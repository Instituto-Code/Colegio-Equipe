import { validationResult } from 'express-validator'

export const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }

    const extractedErros = []

    errors.array().map(err => extractedErros.push(err))

    res.status(422).json({
        errors: extractedErros
    })

}

