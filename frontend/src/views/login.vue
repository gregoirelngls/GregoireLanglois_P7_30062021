<template>
  <!--  -->
  <div class="card">
    <!-- Utilisation du rendu conditionnel. On retrouve chez champs similaires entre l'inscription et la connexion,
      on va donc faire apparaitre ou disparaitre certains champs avec V-if et V-else et en utilisant les fonctions toLogin et toCreateAccount -->
    <img class="logo" src="../assets/logo.png" alt="Logo de groupomania" />
    <h1 class="card__title" v-if="mode == 'login'">Se connecter</h1>
    <h1 class="card__title" v-else>S'inscire</h1>
    <p class="card__subtitle" v-if="mode == 'login'">
      Tu n'as pas encore de compte ?
      <span class="card__action" @click="createAnAccount()"
        >Créer un compte</span
      >
    </p>
    <p class="card__subtitle" v-else>
      Tu as déjà un compte ?
      <span class="card__action" @click="toLogin()">Se connecter</span>
    </p>
    <div class="form-row">
      <input
        v-model="email"
        class="form-row__input"
        type="text"
        placeholder="Adresse mail"
      />
    </div>
    <div class="form-row" v-if="mode == 'create'">
      <input
        v-model="username"
        class="form-row__input"
        type="text"
        placeholder="Username"
      />
    </div>
    <div class="form-row" v-if="mode == 'create'">
      <input
        v-model="bio"
        class="form-row__input"
        type="text"
        placeholder="Votre biographie (facultative)"
      />
    </div>
    <div class="form-row">
      <input
        v-model="password"
        class="form-row__input"
        type="password"
        placeholder="Mot de passe"
      />
    </div>
    <!-- si le status nous renvoi à la méthode error_login, on envoie le message qui suit. -->
    <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
      Adresse mail et/ou mot de passe invalide
    </div>
    <!-- si le status nous renvoi à la méthode error_create, on envoie le message qui suit. -->
    <div class="form-row" v-if="mode == 'create' && status == 'error_create'">
      Adresse mail déjà utilisée
    </div>
    <!-- Utilisation du BEM pour le button--disabled. Quand les champs sont bien renseignés, le button "disabled" s'enlève,
    et nos champs sont cliquables.-->
    <div class="form-row">
      <!-- Lorsqu'on clique sur le bouton, on appelle la méthode "login" -->
      <button
        id="login"
        @click="login()"
        class="button"
        :class="{ 'button--disabled': !validatedFields }"
        v-if="mode == 'login'"
      >
        <span v-if="status == 'loading'">Connexion en cours...</span>
        <span v-else>Connexion</span>
      </button>
      <!-- Lorsqu'on clique sur le boutton, on appelle la méthode createAccount. -->
      <button
        id="account"
        @click="createAccount()"
        class="button"
        :class="{ 'button--disabled': !validatedFields }"
        v-else
      >
        <span v-if="status == 'loading'">Création en cours...</span>
        <span v-else>Créer mon compte</span>
      </button>
    </div>
  </div>
</template>

<script>
//On importe mapState car vuex nous fournit un moyen d'associer le state à des variables que nous pouvons appeler dans nos composants,
//évitant ainsi de devoir appeler $store à chaque fois : mapState.
import { mapState } from "vuex";
export default {
  name: "Login",
  // Dans la data, on passe nos variables pour pouvoir binder dessus*/
  data: function() {
    return {
      mode: "login",
      email: "",
      username: "",
      bio: "",
      password: "",
    };
  },
  mounted: function() {
    if (this.$store.state.user.userId != -1) {
      this.$router.push("/messages");
      return;
    }
  },
  /* Pour les champs validés, on utilise la méthode computed, dans laquelle on ajoute une fonction.
  Si dans le mode create nos champs ne sont pas vident, on retourne "true, dans le cas contraire, on retourne false*/
  computed: {
    validatedFields: function() {
      if (this.mode == "create") {
        if (this.email != "" && this.username != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
        /* Si on est en mode login, on fait pareil mais seulement avec l'email et le mot de passe.*/
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    // On appelle mapState qui va servir comme zone de stockage des données.
    ...mapState(["status"]),
  },
  // Méthode qui vont permettre d'afficher des éléments de la page
  // en fonction du "v-if=mode ... dans les balises html"
  methods: {
    createAnAccount: function() {
      this.mode = "create";
    },
    toLogin: function() {
      this.mode = "login";
    },
    /* Dans cette fonction Login, on créer des actions dans le store, (en utilisant $store), et en ajoutant nos variables.*/
    login: function() {
      // pas d'accès au "this" car nous sommes dans un sous élement, on créer donc une constante "self" qu reprend l'élement "this".
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
          // Une fois que la connexion s'est bien effectué, on passe dans le".then", et on affiche le mur avec les messages de tous les utilisateurs.
        })
        .then(
          function() {
            self.$router.push("/messages");
          },
          function(error) {
            console.log(error);
          }
        );
    },
    /* Dans cette fonction, on créer des actions dans le store, (this.$store.dispatch), et en ajoutant nos variables de création de compte.*/
    createAccount: function() {
      // pas d'accès au "this" car nous sommes dans un sous élement, on créer donc une constante "self" qu reprend l'élement "this".
      const self = this;
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          username: this.username,
          bio: this.bio,
          password: this.password,
        })
        .then(
          function() {
            // Après avoir créer un compte, on appelle la méthode de login, car les champs sont similaire et cela doit nous connecter après la création du compte.
            self.login();
          },
          function(error) {
            console.log(error);
          }
        );
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap");
* {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  max-width: 100%;
}
body {
  background-color: rgb(255, 133, 133);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
}
img {
  max-width: 100%;
  border-radius: 8px;
}
.card {
  max-width: 100%;
  width: 40%;
  background: white;
  border-radius: 16px;
  padding: 32px;
  justify-content: center;
  margin-left: 30%;
  margin-top: 5%;
}
.card__title {
  text-align: center;
  font-weight: 800;
}
.card__subtitle {
  text-align: center;
  color: #666;
  font-weight: 500;
}
.button {
  background: #2196f3;
  color: white;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  width: 100%;
  padding: 16px;
  transition: 0.4s background-color;
}
.card__action {
  color: #2196f3;
  text-decoration: underline;
}
.card__action:hover {
  cursor: pointer;
}
.button:hover {
  cursor: pointer;
  background: #1976d2;
}
.button--disabled {
  background: #cecece;
  color: #ececec;
}
.button--disabled:hover {
  cursor: not-allowed;
  background: #cecece;
}

.logo {
  padding-bottom: 10%;
  display: flex;
}
.form-row {
  display: flex;
  margin: 10px 0px;
  gap: 16px;
  flex-wrap: wrap;
}
.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
}
.form-row__input::placeholder {
  color: #aaaaaa;
}</style
>>
