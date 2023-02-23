// Importando as funções necessárias do Firebase
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, onValue, child, get, set, update } = require('firebase/database');


// Importando as configurações do Firebase a partir do arquivo config.json
const config = require("../config.json");

// Configurando o Firebase com as configurações obtidas do arquivo config.json
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  databaseURL: config.databaseURL,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};
const app = initializeApp(firebaseConfig); // Iniciando o Firebase com as configurações obtidas

// Definindo a classe Post, que representa um post no banco de dados
class Post {
  constructor(id, titulo, legenda, conteudo, status = 'pendente') {
    this.id = id;
    this.titulo = titulo;
    this.legenda = legenda;
    this.conteudo = conteudo;
    this.status = status;
  }

  // Função para criar um novo post no banco de dados
  async createPost(post) {
    const db = getDatabase();
    const postRef = ref(db, `posts/${post.id}`); // Usando o ID do post como nome do nó
  
    try {
      await set(postRef, post);
      console.log('Post adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar o post: ', error);
    }
  }
  // Função para retornar um post específico com base no ID do banco de dados
  async getPostById(id) {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postRef = ref(db, `posts/${id}`); // Obtendo a referência para o post com base no ID
  
    try {
      const snapshot = await get(postRef); // Obtendo os dados do post
  
      if (snapshot.val() === null) { // Verificando se o valor retornado é null
        throw new Error(`Post ${id} não existe`);
      }
  
      const post = snapshot.val(); // Obtendo os dados do post
      const postObj = new Post(post.id, post.titulo, post.legenda, post.conteudo, post.status);
      return postObj; // Retornando o objeto Post
    } catch (error) {
      throw new Error(`Erro ${id}: ${error}`);
    }
  }

  // Função para retornar todos os posts do banco de dados
  async getPosts() {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postsRef = ref(db, 'posts'); // Obtendo a referência para os dados da referência 'posts'

    // Criando uma nova Promise para tratar o resultado da consulta
    return new Promise((resolve, reject) => {
      onValue(postsRef, (snapshot) => { // Escutando todas as mudanças nos dados da referência 'posts'
        const posts = []; // Array que irá armazenar os posts recuperados do banco de dados
        snapshot.forEach((childSnapshot) => { // Iterando sobre cada post encontrado
          const post = childSnapshot.val(); // Obtendo os dados do post
          posts.push(new Post(post.id, post.titulo, post.legenda, post.conteudo)); // Adicionando um novo objeto Post ao array posts
        });
        resolve(posts); // Resolvendo a Promise com o array de posts
      }, (error) => {
        reject(error); // Rejeitando a Promise caso ocorra algum erro na consulta
      });
    });
  }

  //Retornando apenas os posts pendentes
  async getPendingPosts() {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postsRef = ref(db, 'posts'); // Obtendo a referência para os dados da referência 'posts'

    // Criando uma nova Promise para tratar o resultado da consulta
    return new Promise((resolve, reject) => {
      const pendingPostsRef = orderByChild(postsRef, 'status').equalTo('pendente');
      onValue(pendingPostsRef, (snapshot) => { // Escutando todas as mudanças nos dados da referência 'posts'
        const posts = []; // Array que irá armazenar os posts recuperados do banco de dados
        snapshot.forEach((childSnapshot) => { // Iterando sobre cada post encontrado
          const post = childSnapshot.val(); // Obtendo os dados do post
          posts.push(new Post(post.id, post.titulo, post.legenda, post.conteudo)); // Adicionando um novo objeto Post ao array posts
        });
        resolve(posts); // Resolvendo a Promise com o array de posts
      }, (error) => {
        reject(error); // Rejeitando a Promise caso ocorra algum erro na consulta
      });
    });
  }
  //Update do post
  async updatePost(post) {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postRef = ref(db, `posts/${post.id}`); // Obtendo a referência do post específico a partir do ID
  
    // Atualizando o post
    return update(postRef, post)
      .then(() => {
        console.log('Post atualizado com sucesso!'); // Mensagem exibida caso a operação de atualização do post seja bem-sucedida
      })
      .catch((error) => {
        console.error('Erro ao atualizar o post: ', error); // Mensagem de erro exibida caso ocorra algum problema na atualização do post
      });
  }

  //Alternando o status do post
  async mudarStatus(post) {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postRef = ref(db, `posts/${post.id}`); // Obtendo a referência do post específico a partir do ID
  
    //Verificando o status atual do post e alterando para o oposto
    if (post.status === 'pendente') {
        return update(postRef, { status: 'postado' })
      .then(() => {
        console.log('Status do post alterado com sucesso!'); // Mensagem exibida caso a operação de atualização do post seja bem-sucedida
      })
      .catch((error) => {
        console.error('Erro ao alterar o status do post: ', error); // Mensagem de erro exibida caso ocorra algum problema na atualização do post
      });
    } 
    else {
        return update(postRef, { status: 'pendente' })
      .then(() => {
        console.log('Status do post alterado com sucesso!'); // Mensagem exibida caso a operação de atualização do post seja bem-sucedida
      })
      .catch((error) => {
        console.error('Erro ao alterar o status do post: ', error); // Mensagem de erro exibida caso ocorra algum problema na atualização do post
      });
    }
  }

  // Função para remover um post do banco de dados
  deletePost(post) {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postRef = remove(ref(db, 'posts'), post); // Removendo o post da referência 'posts' do banco de dados

    postRef
      .then(() => {
        console.log('Post deletado com sucesso!'); // Mensagem exibida caso a operação de exclusão do post
        })
       .catch((error) => {
         console.error('Erro ao deletar o post: ', error);
        });
    }
}

module.exports = Post;