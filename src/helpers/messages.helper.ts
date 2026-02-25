type Message = string | ((...args: any[]) => string)

type ObjectNotFoundOptions = {
    name: string
    value: string | number
    property?: string
}

type DuplicateObjectOptions = {
    name: string
    value: string | number
    property?: string
}

export const messagesHelper = {
    OBJECT_NOT_FOUND: ({ name, value, property = "id" }: ObjectNotFoundOptions) =>
        `O objeto '${name}' com ${property} '${value}' não foi encontrado no banco de dados!`,
    OBJECT_ALREADY_EXISTS: ({ name, value, property = "id" }: DuplicateObjectOptions) =>
        `Já existe um objeto '${name}' com ${property} '${value}' no banco de dados!`,
    UNAUTHORIZED_USER: "Usuário não autorizado!",
    REQUEST_WITHOUT_AUTHORIZATION_TOKEN:
        "A solicitação não enviou nenhum token de autorização! Forneça um token para acessar rotas protegidas!",
    INVALID_AUTHORIZATION_TOKEN:
        "Este token de autorização é inválido por algum motivo! Tente renová-lo ou tente novamente!",
    INVALID_CREDENTIALS: "Email ou senha inválidos!",
    RESOURCE_ID_NOT_PROVIDED: "O Id do recurso não foi fornecido na solicitação.",
    RESOURCE_NOT_FOUND: "O recurso solicitado não foi encontrado.",
    RESOURCE_ACCESS_UNAUTHORIZED: "Você não está autorizado a acessar este recurso.",
    CANNOT_DELETE_SELF: "Você não pode excluir a si mesmo!",
    INVALID_API_KEY: "Chave de API inválida!",
} satisfies Record<string, Message>
