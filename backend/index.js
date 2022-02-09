//Inicio do projeto backend, onde terá uma conexao com o banco, verificação de token e .
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ BCRYPT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//importação do bycrypt
const bycrypt = require("bcrypt");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JWP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Importação do módulo verificaToken(JWP)
const verificaToken = require("../backend/verificaToken");

//Importação do módulo que gera o token(JWP)
const gerarToken = require("../backend/gerarToken");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPRESS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Importar o módulo de conexão com o servidor(EXPRESS).
const express = require("express");

//Vamos usar o servidor express passando como referência a constate app.
const app = express();

//Preparar o servidor para receber dados.
app.use(express.json());

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ BANCO DE DADOS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Importar o módulo de conexão com o banco de dados(MYSQL).
const mysql = require("mysql");

//Conexão com o banco de dados.
const conexaoDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbSaude",
});

//Teste e conexão com o banco de dados.
conexaoDB.connect((erro) => {
  if (erro) {
    console.error("Erro ao tentar estabelecer conexão" + erro.stack);
    return;
  }
  console.log("Coectado ao banco:" + conexaoDB.threadId);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CORS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Importar o módulo que faz a conexão entre Http e Js(CORS).
const cors = require("cors");

//Aplicar o Cors na aplicação.
app.use(cors());

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CRUD PRODUTOS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Teste de rotas usando a arquitetura http com os verbos GET, SET, PUT e DELET
//--------------->     GET
app.get("/saudemais/produtos/listar", (req, res) => {
  //Consultar sql para selecionar os produtos no banco de dados.
  conexaoDB.query("select * from tbproduto", (erro, resultado) => {
    if (erro) {
      return res
        .status(500)
        .send({ msg: "Erro ao tentar executar a consulta" + erro });
    }
    res.status(200).send({ msg: resultado });
  });
});

//--------------->     GET (ID)
app.get("/saudemais/produtos/buscar/:id", (req, res) => {
  conexaoDB.query(
    "select * from tbproduto where idProduto=?",
    [req.params.id],
    (erro, resultado) => {
      if (erro) {
        return res
          .status(500)
          .send({ msg: `Erro ao tentar executar consultac${erro}` });
      }
      if (resultado == null || resultado == "") {
        return res
          .status(404)
          .send({ msg: `Não foi possivel localizar este produto` });
      }
      res.status(200).send({ msg: resultado });
    }
  );
});

//--------------->  POST
app.post("/saudemais/produtos/cadastrar", (req, res) => {
  conexaoDB.query(
    "insert into tbProduto set ?",
    [req.body],
    (erro, resultado) => {
      if (erro) {
        res.status(500).send({ msg: `Não foi possível cadastrar -> ${erro}` });
        return;
      }
      res.status(201).send({ msg: resultado });
    }
  );
});

//--------------->  PUT
app.put("/saudemais/produtos/atualizar/:id", (req, res) => {
  conexaoDB.query(
    "update tbproduto set ? where idProduto=?",
    [req.body, req.params.id],
    (erro, resultado) => {
      if (erro) {
        res
          .status(500)
          .send({ msg: `Erro ao tentar atualizar dados ->${erro}` });
        return;
      }
      res.status(200).send({ msg: resultado });
    }
  );
});

//--------------->  DELET
app.delete("/saudemais/produtos/apagar/:id", (req, res) => {
  conexaoDB.query(
    "delete from tbproduto where idProduto = ?",
    [req.params.id],
    (erro, resultado) => {
      if (erro) {
        res
          .status(500)
          .send({ msg: `Erro ao tentar apagar o produto -> ${erro}` });
        return;
      }
      res.status(204).send({ msg: resultado });
    }
  );
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FINAL DO CRUD PRODUTOS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CRUD CLIENTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--------------->     GET
app.get("/saudemais/usuarios/listar", (req, res) => {
  conexaoDB.query("select * from tbusuario", (erro, resultado) => {
    if (erro) {
      return res
        .status(500)
        .send({ msg: "Erro ao tentar executar a consulta" + erro });
    }
    res.status(200).send({ msg: resultado });
  });
});
//--------------->     GET(LOGOUT)
app.get("/logout", verificaToken, (req, res) => {
  conexao.query(
    "update acesso set datahoralogout=now() where idUsuario=? order by idacesso desc limit 1",
    [req.content.id],
    (erro, resultado) => {
      if (erro)
        return res.status(500).send({ retorno: `Erro interno -> ${erro}` });
      res.status(200).send({ retorno: "Logout" });
    }
  );
});

//--------------->     GET (ID)
app.get("/saudemais/usuarios/buscar/:id", (req, res) => {
  conexaoDB.query(
    "select * from tbusuario where idUsuario=?",
    [req.params.id],
    (erro, resultado) => {
      if (erro) {
        return res
          .status(500)
          .send({ msg: `Erro ao tentar executar consulta${erro}` });
      }
      if (resultado == null || resultado == "") {
        return res
          .status(404)
          .send({ msg: `Não foi possivel localizar este usuario` });
      }
      res.status(200).send({ msg: resultado });
    }
  );
});

//--------------->  POST(CADASTRO)
app.post("/saudemais/usuarios/cadastrar", (req, res) => {
  //Hash de senha(bcrypt)
  bycrypt.hash(req.body.password, 10, (erro, msg) => {
    if (erro)
      return res.status(500).send({ msg: `Erro ao gerar senha : ${erro}` });
    req.body.password = msg;

    conexaoDB.query(
      "insert into tbusuario set ?",
      [req.body],
      (erro, resultado) => {
        if (erro) {
          res
            .status(500)
            .send({ msg: `Não foi possível cadastrar -> ${erro}` });
          return;
        }
        res.status(201).send({ msg: resultado });
      }
    );
  });
});

//--------------->  POST(LOGIN)
app.post("/login", (req, res) => {
  conexao.query(
    "SELECT * FROM tbusuario WHERE id=?",
    [req.body.id],
    (erro, resultado) => {
      if (erro) return res.status(500).send({ msg: `Erro -> ${erro}` });

      if (dados == null)
        return res.status(404).send({ msg: `Usuário ou senha incorreto` });

      bcrypt.compare(req.body.senha, dados[0].senha, (erro, igual) => {
        if (erro)
          return res.status(500).send({ retorno: `Erro interno -> ${erro}` });
        if (!igual) return res.status(400).send({ retorno: `Senha incorreta` });

        var gerado = gerarToken(
          resultado[0].idUsuario,
          resultado[0].user,
        );

        //Chamar a função que grava os dados de acesso do usuário
        gravarAcesso(dados[0].idusuario, JSON.stringify(req.headers));

        res.status(200).send({ retorno: "Logado", token: gerado });
      });
    }
  );
});


//--------------->  PUT(ID)
app.put("/saudemais/usuarios/alterar/:id", (req, res) => {
  conexaoDB.query(
    "update tbusuario set ? where id=?",
    [req.body, req.params.id],
    (erro, resultado) => {
      if (erro) {
        res
          .status(500)
          .send({ msg: `Erro ao tentar atualizar dados ->${erro}` });

        if (resultado == null || resultado == "")
          return res.status(404).send({ retorno: `Usuario não localizado` });
        res.status(200).send({ msg: resultado });
      }
    }
  );
});
//--------------->  PUT(SENHA)
app.put("/saudemais/usuarios/alterarsenha/:id", (req, res) => {
  bycrypt.hash(req.body.password, 10, (erro, msg) => {
    if (erro)
      return res
        .status(500)
        .send({ retorno: `Erro ao tentar atualizar->${erro}` });
    req.body.password = msg;
    conexao.query(
      "UPDATE usuario set senha=? where id=?",
      [req.body.password, req.params.id],
      (erro, resultado) => {
        if (erro)
          return res
            .status(500)
            .send({ retorno: `Erro ao tentar atualizar -> ${erro}` });

        if (resultado == null || resultado == "")
          return res.status(404).send({ retorno: `Usuário não localizado` });
        res.status(200).send({ retorno: resultado });
      }
    );
  });
});


//--------------->  DELET
app.delete("/saudemais/usuarios/apagar/:id", (req, res) => {
  conexaoDB.query(
    "delete from tbusuario where idsuario = ?",
    [req.params.id],
    (erro, resultado) => {
      if (erro) {
        res
          .status(500)
          .send({ msg: `Erro ao tentar apagar o usuario -> ${erro}` });
        return;
      }
      res.status(204).send({ msg: resultado });
    }
  );
});
//Vamos subir o servidor na porta:5000
app.listen("5000", () =>
  console.log("Servidor online em http://localhost:5000")
);

//Criar a função gravarAcesso. Esta função grava as informações do usuário quando ele
//realiza a autenticação.
function gravarAcesso(id, dados) {
  conexaoDB.query(
    "INSERT INTO acesso SET idUsuario=?, resultado=?",
    [id, dados],
    (erro, resultado) => {
      if (erro) {
        console.log(`Erro interno->${erro}`);
        return;
      }
    }
  );
}

// Expor o módulo de usuário para todo o projeto
module.exports = app;
