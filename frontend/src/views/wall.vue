<!-- -->
<template>
  <div id="app">
    <Header />
    <CreateMessage />
    <ul id="listMessages">
      <li id="listMessage" v-for="message in messages" :key="message.id">
        <span class="userName"
          ><strong>Publié par :</strong> {{ message.User.username }} <br />
          le {{ message.createdAt.split("T")[0] }} à
          {{ message.createdAt.slice(11, 16) }}
        </span>
        <br />
        <div id="contentMessage">
          <p v-if="message.attachment"></p>
          <img :src="message.attachment" alt="" />
          <span class="userContent"> {{ message.content }} </span> <br />
        </div>
        <div id="footer-messages">
          <Thumbs :message="message" />

          <div id="buttons">
            <!-- <p v-if="user.id == message.userId"> -->
            <button
              class="button deleteMessage"
              @click="deleteMessage(message.id)"
            >
              DELETE
            </button>
            <button class="button updateMessage">UPDATE</button>
            <!-- </p> -->
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
      userId: localStorage.getItem("userId"),
    };
  },
  methods: {
    getData() {
      axios
        .get("http://localhost:3000/api/message", {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then((response) => {
          console.log("oyoooo", this.message);
          console.log("coucou", this.messages);
          this.messages = response.data;
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
          alert("êtes vous sûr de vouloir supprimer votre message ?");
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
  width: 60%;
}
#listMessage {
  background-color: white;
  border: 3px solid rgb(4, 4, 122);
  margin-top: 2%;
  border-radius: 10px;
}

#contentMessage {
  display: flex;
  flex-direction: column;
}

#buttons {
  padding: 5px 10px;
  border: none;
  transition-duration: 0.4s;
  margin: 1%;
  border-radius: 10px;
  width: 50%;
  display: flex;
  flex-direction: row-reverse;
}
.button {
  color: white;
  font-size: 1.5vw;
  padding: 5px 10px;
  border-radius: 10px;
}
.button:focus {
  outline: none;
  box-shadow: none;
}
.updateMessage {
  background-color: #0c007a;
}
.updateMessage:hover {
  background-color: #100035;
}
.deleteMessage {
  background-color: red;
}
.deleteMessage:hover {
  background-color: rgb(161, 0, 0);
}
#footer-messages {
  display: flex;
  border-top: 1px dashed grey;
  margin-top: 2%;
}
</style>
