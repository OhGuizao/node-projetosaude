//Inicio do projeto backend, onde terá uma conexao com o banco.

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
    database: "dbSaude"
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
    conexaoDB.query("select * from tbProduto", (erro, resultado) => {
        if (erro) {
            return res.status(500).send({ msg: "Erro ao tentar executar a consulta" + erro });
        }
        res.status(200).send({ msg: resultado })
    })
});

//--------------->     GET (ID)
app.get("/saudemais/produtos/buscar/:id", (req, res) => {

    conexaoDB.query("select * from tbProduto where idProduto=?", [req.params.id], (erro, resultado) => {
        if (erro) {
            return res.status(500).send({ msg: `Erro ao tentar executar consultac${erro}` });
        }
        if (resultado == null || resultado == "") {
            return res.status(404).send({ msg: `Não foi possivel localizar este produto` });
        }
        res.status(200).send({ msg: resultado });
    });
});

//--------------->  POST
app.post("/saudemais/produtos/cadastro", (req, res) => {
    conexaoDB.query("insert into tbProduto set ?", [req.body], (erro, resultado) => {
        if (erro) {
            res.status(500).send({ msg: `Não foi possível cadastrar -> ${erro}` });
            return;
        }
        res.status(201).send({ msg: resultado })
    })
});

//--------------->  PUT
app.put("/saudemais/produtos/atualizar/:id", (req, res) => {
    conexaoDB.query("update tbProduto set ? where idProduto=?", [req.body, req.params.id], (erro, resultado) => {

        if (erro) {
            res.status(500).send({ msg: `Erro ao tentar atualizar dados ->${erro}` });
            return;
        }
        res.status(200).send({ msg: resultado });
    })
});

//--------------->  DELET
app.delete("/saudemais/produtos/apagar/:id", (req, res) => {
    conexaoDB.query("delete from tbProduto where idProduto = ?", [req.params.id], (erro, resultado) => {
        if (erro) {
            res.status(500).send({ msg: `Erro ao tentar apagar o produto -> ${erro}` });
            return;
        }
        res.status(204).send({ msg: resultado });
    })
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FINAL DO CRUD PRODUTOS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CRUD CLIENTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--------------->     GET
app.get("/saudemais/usuarios/listar", (req, res) => {
    conexaoDB.query("select * from tbUsuario", (erro, resultado) => {
        if (erro) {
            return res.status(500).send({ msg: "Erro ao tentar executar a consulta" + erro });
        }
        res.status(200).send({ msg: resultado })
    })
});

//--------------->     GET (ID)
app.get("/saudemais/usuarios/buscar/:id", (req, res) => {

    conexaoDB.query("select * from tbUsuario where idUsuario=?", [req.params.id], (erro, resultado) => {
        if (erro) {
            return res.status(500).send({ msg: `Erro ao tentar executar consultac${erro}` });
        }
        if (resultado == null || resultado == "") {
            return res.status(404).send({ msg: `Não foi possivel localizar este produto` });
        }
        res.status(200).send({ msg: resultado });
    });
});

//--------------->  POST
app.post("/saudemais/produtos/cadastro", (req, res) => {
    conexaoDB.query("insert into tbUsuario set ?", [req.body], (erro, resultado) => {
        if (erro) {
            res.status(500).send({ msg: `Não foi possível cadastrar -> ${erro}` });
            return;
        }
        res.status(201).send({ msg: resultado })
    })
});

//--------------->  PUT
app.put("/saudemais/produtos/atualizar/:id", (req, res) => {
    conexaoDB.query("update tbUsuario set ? where idUsuario=?", [req.body, req.params.id], (erro, resultado) => {

        if (erro) {
            res.status(500).send({ msg: `Erro ao tentar atualizar dados ->${erro}` });
            return;
        }
        res.status(200).send({ msg: resultado });
    })
});

//--------------->  DELET
app.delete("/saudemais/produtos/apagar/:id", (req, res) => {
    conexaoDB.query("delete from tbUsuario where idsuario = ?", [req.params.id], (erro, resultado) => {
        if (erro) {
            res.status(500).send({ msg: `Erro ao tentar apagar o produto -> ${erro}` });
            return;
        }
        res.status(204).send({ msg: resultado });
    })
});
//Vamos subir o servidor na porta:5000
app.listen("5000", () => console.log("Servidor online em http://localhost:5000"));

module.exports = app;