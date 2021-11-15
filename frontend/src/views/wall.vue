<!-- -->
<template>
  <div id="app">
    <Header />
    <CreateMessage />
    <ul id="listMessages">
      <li id="listMessage" v-for="message in messages" :key="message.id">
        <span class="userName"
          ><span id="strong">Publié par :</span> {{ message.User.username }}
          <br />
          <span id="strong">le </span> {{ message.createdAt.split("T")[0] }} à
          {{ message.createdAt.slice(11, 16) }}
        </span>
        <br />
        <div id="contentMessage">
          <p v-if="message.attachment"></p>
          <img :src="message.attachment" alt="" />
          <span class="userContent"> {{ message.content }} </span>
        </div>
        <div id="footer-messages">
          <Thumbs :message="message" />

          <div id="btns">
            <p v-if="$store.state.user.isAdmin || userId == message.userId">
              <button
                class="button deleteMessage"
                aria-label="supression du message"
                @click="deleteMessage(message.id)"
              >
                DELETE
              </button>
              <router-link class="routerLink" :to="`/Edit/${message.id}`">
                <button
                  class="button updateMessage"
                  aria-label="modification du message"
                >
                  UPDATE
                </button>
              </router-link>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import Header from "../components/Header";
import Thumbs from "../components/Thumbs";
import CreateMessage from "../components/CreateMessage";

export default {
  name: "Wall",
  components: {
    Header,
    Thumbs,
    CreateMessage,
  },
  data() {
    return {
      message: {
        id: "",
        content: "",
        attachment: "",
      },
      messages: [],
      userId: null,
    };
  },

  methods: {
    getData() {
      this.userId = JSON.parse(localStorage.getItem("user")).userId;
      axios
        .get("http://localhost:3000/api/message", {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then((response) => {
          this.messages = response.data;
          console.log(this.messages);
          this.messages.map((message) => {
            message.attachment = require(`../assets/${message.attachment}`);
            return message;
          });
        })
        .catch(() => console.log());
    },

    deleteMessage(id) {
      axios
        .delete("http://localhost:3000/api/message/delete/" + id, {
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then(() => {
          console.log("quoi ??", this.message.id);
          confirm("êtes vous sûr de vouloir supprimer votre message ?");
          location.reload();
        })
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>
#listMessages {
  list-style: none;
  margin: auto;
  padding: 0px;
  width: 50%;
}
#listMessage {
  background-color: white;
  border: 3px solid rgb(4, 4, 122);
  margin-top: 2%;
  border-radius: 10px;
}

img {
  max-width: 100%;
  max-height: 350px;
  object-fit: cover;
}

#contentMessage {
  display: flex;
  flex-direction: column;
}

#btns {
  width: 50%;
  align-self: center;
  text-align: center;
  vertical-align: center;
  margin-top: inherit;
  margin-left: 2%;
}

.button {
  color: white;
  font-size: 1vw;
  padding: 5px 10px;
  border-radius: 10px;
  margin-left: 6%;
  font-weight: bold;
  margin-top: 2%;
}
.button:focus {
  outline: none;
  box-shadow: none;
}
.updateMessage:hover {
  background-color: #0c007a;
}
.updateMessage {
  background-color: #160146;
}
.deleteMessage {
  background-color: rgb(66, 10, 10);
}
.deleteMessage:hover {
  background-color: rgb(173, 25, 25);
}
#footer-messages {
  display: flex;
  border-top: 1px dashed grey;
  margin-top: 2%;
}

.userContent {
  margin-top: 3%;
}

#strong {
  font-weight: bold;
}

@media (min-width: 1200px) {
  #listMessages {
    width: 35%;
  }
}

@media (max-width: 670px) {
  #listMessages {
    width: 80%;
  }
}
</style>
