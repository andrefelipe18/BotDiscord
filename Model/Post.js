// Importando as funções necessárias do Firebase
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, onValue, set, update , remove, child, exists} = require('firebase/database');


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
    const postRef = child(ref(db), `posts/${id}`); // Obtendo a referência para o post com o ID correspondente

    const snapshot = await get(postRef); // Obtendo os dados do post

   if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
  }
  //Função que vai me retornar um array com todos os posts do banco de dados em tempo real
  async getPosts() {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postRef = ref(db, 'posts'); // Obtendo a referência para todos os posts

    const snapshot = await get(postRef); // Obtendo os dados do post

    let posts = [] // Array que vai conter todos os posts

    snapshot.forEach(post => { // Percorrendo todos os posts
      posts.push(post.val()) // Adicionando o post no array
    })

    return posts
  }
  
  //Retornando apenas os posts pendentes
  async getPendingPosts() {
    let allPosts = await this.getPosts()
    const pendingPosts = [];

    allPosts.forEach(post => {
      if(post.status == 'pendente') {
        pendingPosts.push(post)
      }
    })

    return pendingPosts
  }

  //Retornando apenas os posts postados
  async getPostedPosts() {
    let allPosts = await this.getPosts()
    const postedPosts = [];

    allPosts.forEach(post => {
      if(post.status == 'postado') {
        postedPosts.push(post)
      }
    })

    return postedPosts
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
        console.log(`Status do post ${post.id} Alterado com sucesso`); // Mensagem exibida caso a operação de atualização do post seja bem-sucedida
      })
      .catch((error) => {
        console.error('Erro ao alterar o status do post: ', error); // Mensagem de erro exibida caso ocorra algum problema na atualização do post
      });
    } 
    else {
        return update(postRef, { status: 'pendente' })
      .then(() => {
        console.log(`Status do post ${post.id} Alterado com sucesso`); // Mensagem exibida caso a operação de atualização do post seja bem-sucedida
      })
      .catch((error) => {
        console.error('Erro ao alterar o status do post: ', error); // Mensagem de erro exibida caso ocorra algum problema na atualização do post
      });
    }
  }

  //Função para remover um post específico com base no ID
  async deletePost(id) {
    const db = getDatabase(); // Obtendo a referência do banco de dados
    const postRef = ref(db, `posts/${id}`); // Obtendo a referência do post específico a partir do ID
  
    // Removendo o post
    return remove(postRef)
      .then(() => {
        console.log(`Post ${id} removido com sucesso!`); // Mensagem exibida caso a operação de remoção do post seja bem-sucedida
      })
      .catch((error) => {
        console.error('Erro ao remover o post: ', error); // Mensagem de erro exibida caso ocorra algum problema na remoção do post
      });
  }
}

module.exports = Post;