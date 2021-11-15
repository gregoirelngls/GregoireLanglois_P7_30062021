<template>
  <div id="app">
    <Header />
    <div id="infoUser">
      <h1>Gestion du compte utilisateur</h1>
      <div class="infoUser__fields">
        <div id="infoProfil" v-bind:key="User.id" v-for="User in Users"></div>
        <span class="user">
          <span id="strong"> Adresse e-mail : </span> {{ User.email }} </span
        ><br />

        <span class="user">
          <span id="strong"> Nom d'utilisateur : </span>
          {{ User.username }} </span
        ><br />
        <span class="user">
          <span id="strong"> Votre biographie : </span>{{ User.bio }} </span
        ><br />
      </div>
      <div id="buttons">
        <button id="logout" @click="logOut" class="button logOut">
          Se déconnecter
        </button>

        <button
          id="deleteaccount"
          @click="deleteAccount(id)"
          class="button deleteAccount"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "../components/Header";

export default {
  name: "User",
  components: {
    Header,
  },

  data() {
    return {
      User: {
        id: "",
        email: "",
        username: "",
        bio: "",
      },
      Users: [],
    };
  },
  methods: {
    getProfil() {
      axios
        .get("http://localhost:3000/api/user/me", {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then((response) => {
          this.User = response.data;
          console.log(this.User);
        })
        .catch((error) => console.log(error));
    },

    logOut() {
      localStorage.clear();
      window.location = "http://localhost:8080/";
    },

    deleteAccount() {
      axios
        .delete("http://localhost:3000/api/user/delete", {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then(() => {
          localStorage.clear();
          window.location = "http://localhost:8080/";
        })
        .catch((error) => console.log(error));
    },
  },

  mounted() {
    this.getProfil();
  },
};
</script>

<style scoped>
#infoUser {
  border: 2px solid blue;
  background-color: white;
  width: 50%;
  margin: 0;
  border-radius: 10px;
  margin-left: 25%;
  margin-top: 5%;
}

.infoUser__fields {
  padding: 4%;
}

#buttons {
  display: flex;
  flex-direction: column;
}

.button {
  font-weight: bold;
  color: white;
  font-size: 1.5vw;
  padding: 5px 10px;
  margin: 2%;
  border-radius: 10px;
}

.button:focus {
  outline: none;
  box-shadow: none;
}

.logOut {
  background-color: #0c007a;
}

.modifyAccount {
  background-color: rgb(0, 90, 53);
}

.deleteAccount {
  background-color: rgb(175, 0, 0);
}

h1 {
  font-size: 3vw;
}

.user {
  font-size: 1em;
}

#strong {
  font-weight: bold;
}

@media only screen and (max-width: 620px) {
  .user {
    font-size: 0.7em;
  }

  #infoUser {
    margin-top: 10%;
  }
}
</style>
