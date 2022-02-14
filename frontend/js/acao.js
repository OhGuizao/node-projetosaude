function cadastrar(){
    var nome = document.getElementById("inputNome");
    var cpf = document.getElementById("inputCpf");
    var idade = document.getElementById("inputIdade");
    var peso = document.getElementById("inputPeso");
    var usuario = document.getElementById("inputUsuario");
    var senha = document.getElementById("inputSenha");
    var tipousu = document.getElementById("inputTipoUsu");

    fetch("http://localhost:5000/saudemais/usuarios/cadastrar", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            tipoUsuario: tipousu.value,
            nomeUsuario: nome.value,
            cpfUsuario: cpf.value,
            idadeUsuario: idade.value,
            pesoUsuario: peso.value,
            user: usuario.value,
            password: senha.value
        })
    })
    .then((response) => response.json())
        .then((dados) => {
            console.log(dados)
            alert(`Dados cadastrados com sucesso!\n Id gerado:${dados.msg.insertId}`);
            document.getElementById("inputNome").value = "";
            document.getElementById("inputCpf").value = "";
            document.getElementById("inputIdade").value = "";
            document.getElementById("inputPeso").value = "";
            document.getElementById("inputUsuario").value = "";
            document.getElementById("inputSenha").value = "";
            document.getElementById("inputTipoUsu").value = "";
            

        })
        .catch((erro) => console.error(`Erro ao cadastrar -> ${erro}`));
}


function carregarDadosAPI() {


    fetch("http://localhost:5000/saudemais/produtos/listar")
        .then((response) => response.json())
        .then((resultado) => {

            var linha = `<div class="row justify-content-md-center">`;

            resultado.msg.map((itens, ix) => {


                linha += `<div class="card col-3 text-center">
                        <center><img src="${itens.fotoProduto}" class="card-img-top" style="width: 250px; height: 250px; align-content: center; justify-content: center;"></center>
                        <div class="card-body">
                            <h5 class="card-title">${itens.nomeProduto}</h5>
                            <p class="card-text">${itens.descricaoProduto}.</p>
                            <p class="card-text"><h4>Preço:</h4>${itens.precoProduto}R$</p>
                        </div>
                        <div class="card-footer">
                            <a href="comprar.html?id=${itens.idProduto}" class="botaoVisu"><h4> Comprar</h4></a>
                        </div>
                    </div>`


            });

            linha += "</div>";

            document.getElementById("conteudo").innerHTML = linha;
        })
        .catch((erro) => console.error(`Erro ai carregar a API -> ${erro}`))
}