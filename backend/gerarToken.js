//importação do módulo jsonwebtoken
const jwt = require("jsonwebtoken");

//Criação do token de sessão para autorização de rotas
//Esse token será criado todas as vezes que o usuário logar no sistema
function gerarToken(id, usuario) {
  return jwt.sign(
    { idUsuario: id, nomeUsuario: usuario},
    "informatica",
    { expiresIn: "1d" }
  );
}

module.exports = gerarToken;
