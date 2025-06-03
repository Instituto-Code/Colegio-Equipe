import { body } from "express-validator"

export const userValidations = () => {
    return[
        body("name")
        .isString()
        .withMessage("O nome é obrigatório!")
        .isLength({ min: 2 })
        .withMessage("o nome precisar ter no mínimo 2 caracteres!"),

        body("email")
        .isString()
        .withMessage("O E-mail é obrigatório!")
        .isEmail()
        .withMessage("Informe um E-mail válido!"),

        body("cpf")
        .isString()
        .withMessage("O CPF é obrigatório!")
        .isLength({ min: 11 })
        .withMessage("O CPF tem que ter no mínimo "),

        body("dataNasc")
        .isDate()
        .withMessage("Informe uma data de nascimento válida!"),

        body("numberTel")
        .isString()
        .withMessage("O número de telefone é obrigatório!"),

        body("password")
        .isString()
        .withMessage("A senha é obrigatória!")
        .isLength({ min: 5 })
        .withMessage("A senha tem que ter no mínimo 5 caracteres!"),

        body("adress")
        .isString()
        .withMessage("Os Campos de endereço são obrigatórios!")

    ]
}
