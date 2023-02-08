
# Aplicação Web Algoritmia

Autores:

* Kesley Kenny Vasques Guimarães
* Pedro Henrique de Brito Agnes

Aplicativo web desenvolvido com a tecnologia `react`, fazendo o papel do *Back Office* do projeto de [TCC](https://github.com/Pedenite/Monografia) da dupla. É complementado com o [*Front Office*](https://github.com/KesleyK/monografia-app).

## Rodar local

Para rodar local, é necessário ter o `npm` e o `node.js` instalados. Segue a documentação oficial de instalação do npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

Em seguida, deve-se rodar o comando de instalação de dependências no projeto:

```sh
npm install
```

Desta forma, o projeto estará pronto para executar, mas para que seja possível acessar todas as funcionalidades, é necessário configurar uma instância do firebase. Para isso, deve-se criar um arquivo chamado `.env` na raíz do repositório. O conteúdo deve seguir o exemplo descrito no arquivo `.env.example` adicionando as chaves obtidas da instância criada do firebase em cada campo (após o `=`):

```sh
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

Por fim, basta executar o aplicativo com o seguinte comando:

```sh
npm start
```

Deste modo, a aplicação web deverá ser inicializada, podendo ser acessada por meio da url http://localhost:3000.
> **Note:** Se outra aplicação já estiver utilizando essa porta, o comando de inicialização irá sugerir que escolha outra porta. Fique atento ao terminal caso isso ocorra.
