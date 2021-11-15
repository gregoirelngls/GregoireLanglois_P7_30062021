import { createStore } from 'vuex'


// Importation d'axios pour pouvoir y faire des requêtes.
const axios = require('axios');

// Création d'une constante "instance" qui va stocker la base de l'URL de notre API.
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
});

let user = localStorage.getItem('user');
if (!user) {
 user = {
    userId: -1,
    token: '',
  }; 
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common['Authorization'] = user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    };
  }
}

// Création d'une nouvelle instance appelée "Store".
const store = createStore({
  // Initialisation d'un status vide.
  state: {
    status: '',
    user: user,
    userInfos: {
      username:'',
      email: '',
      bio: '',
      isAdmin: false,
    },
    message:{

    },
    totalLike:0,
  },
  getter: {

  },
  // Puisqu'un état de store de Vuex est rendu réactif par Vue,
  // lorsque nous mutons l'état, les composants Vue observant cet état seront automatiquement mis à jour.
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      instance.defaults.headers.common['Authorization'] = user.token;
      localStorage.setItem('user', JSON.stringify(user));
      console.log("bonjour", user);
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    logout: function (state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    totalLike: function (state) {
      state.totalLike++;
    }
  },
  actions: {
    // Même fonctionnement que pour la création du compte, on change juste les paramêtres de l'instance 
    login: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('/user/login', userInfos)
        .then(function (response) {
          commit('setStatus', '');
          commit('logUser', response.data);
          resolve(response);
          console.log(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error_login');
          reject(error);
        });
      });
    },
    // Premièrement, dans l'action de création d'un compte, on récupère le commit pour pouvoir éxécuter la mutation de lorsqu'on créer le compte ainsi que les userInfos en second paramêtre. */
    createAccount: ({commit}, userInfos) => {
      console.log(userInfos);
      commit('setStatus', 'loading');
      // On retourne une nouvelle promesse 
      return new Promise((resolve, reject) => {
        commit;
        //On récupère la terminaison de la route post concernant la création d'un nouvel utilisateurs, on ajoutant en second paramêtre, les userInfos, le tout à partir de la nouvelle configuration d'axios, nommée "instance".
        instance.post('/user/register', userInfos)
        // Si tout se passe bien, on va utiliser le paramêtre resolve, pour la création du compte utilisateur.
        .then(function (response) {
          commit('setStatus', 'created');
          resolve(response);
          console.log(response);
        })
        // Si ca ne se passe pas bien, on récupère l'erreur avec le .catch en utilisant le paramêtre error.
        // On comit également le paramêtre error_create qui sera retranscrit dans le template de login.vue.
        .catch(function (error) {
          commit('setStatus', 'error_create');
          reject(error);
        });
      });
    },
    // incrementLike: ({commit}, totalLike) => {
    //   console.log(totalLike);
    //   return new Promise((resolve, reject) => {
    //     commit;
    //     instance.post('messages/vote/like/' + message.id)
    //     .then(function (response) {
    //       commit('incrementLike', 'userInfos');
    //       resolve(response);
    //       console.log(response);
    //     })
    //     .catch(function (error) {
    //       commit('incrementLike', '');
    //       reject(error);
    //     });
    //   })
    // }
  }
})

export default store;
