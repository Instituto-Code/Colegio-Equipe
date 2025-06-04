import { body } from "express-validator"


//Validações de cadastro
export const userValidations = () => {
    return[
        body("name")
        .trim()
        .isString()
        .withMessage("O nome é obrigatório!")
        .isLength({ min: 2 })
        .withMessage("o nome precisar ter no mínimo 2 caracteres!"),

        body("email")
        .trim()
        .isString()
        .withMessage("O E-mail é obrigatório!")
        .isEmail()
        .withMessage("Informe um E-mail válido!"),

        body("cpf")
        .trim()
        .isString()
        .withMessage("O CPF é obrigatório!")
        .isLength({ min: 11 })
        .withMessage("O CPF tem que ter no mínimo 11 dígitos"),

        body("dataNasc")
        .isDate()
        .withMessage("Informe uma data de nascimento válida!"),

        body("numberTel")
        .trim()
        .isString()
        .withMessage("O número de telefone é obrigatório!"),

        body("password")
        .trim()
        .isString()
        .withMessage("A senha é obrigatória!")
        .isLength({ min: 6 })
        .withMessage("A senha tem que ter no mínimo 6 caracteres!"),


        //Validações de endereço
        body("adress.rua")
        .trim()
        .notEmpty()
        .withMessage("Campo rua é obrigatório!"),

        body("adress.numero")
        .trim()
        .notEmpty()
        .withMessage("Campo número é obrigatório!"),

        body("adress.bairro")
        .trim()
        .notEmpty()
        .withMessage("Campo bairro é obrigatório!"),

        body("adress.cidade")
        .trim()
        .notEmpty()
        .withMessage("Campo cidade é obrigatório!"),

        body("adress.estado")
        .trim()
        .notEmpty()
        .withMessage("Campo estado é obrigatório!"),

        body("adress.cep")
        .trim()
        .notEmpty()
        .withMessage("Campo CEP é obrigatório!")
    ]
}

//Valdações de login
export const userLoginValidations = () => {
    return[
        body("email")
        .notEmpty()
        .withMessage("E-mail é obrigatório!")
        .isEmail()
        .withMessage("Informe um E-mail válido!"),

        body("password")
        .notEmpty()
        .withMessage("Senha é obrigatória!")
        .isString()
        .withMessage("Informe uma senha válida!")
    ]
}

//Validações de edição de usuário
export const userUpdateData = () => {
    return[
        body("name")
        .optional()
        .isString()
        .withMessage("O campo nome não pode está vazio!"),

        body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("A senha tem que ter no mínimo 6 caracteres!")
    ]
}

