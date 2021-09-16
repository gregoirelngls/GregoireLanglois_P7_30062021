<!-- -->
<template>
  <div id="app">
    <Header />
    <h1>T'as enfin reussi à te connecter à l'application groupomania !!"</h1>
    <ul id="listMessages">
      <li id="listMessage" v-bind:key="message.id" v-for="message in messages">
        <span class="userName">{{ message.User.username }} </span> <br />
        <span class="userAttachment"> {{ message.attachment }} </span> <br />
        <span class="userContent">{{ message.content }} </span> <br />
        <div id="footer-messages">
          <Thumbs />
          <div id="buttons">
            <button
              class="button deleteMessage"
              @click="deleteMessage(message.id)"
            >
              DELETE
            </button>
            <button class="button updateMessage">UPDATE</button>
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

export default {
  name: "Wall",
  components: {
    Header,
    Thumbs,
  },
  data() {
    return {
      message: {
        id: "",
        content: "",
        attachment: "",
      },
      messages: [],
    };
  },
  methods: {
    getData() {
      axios
        .get("http://localhost:3000/api/message", {
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then((response) => {
          this.messages = response.data;
        })
        .catch((error) => console.log(error));
    },

    deleteMessage(id) {
      console.log(id);
      axios
        .delete("http://localhost:3000/api/message/delete/" + id, {
          headers: {
            "content-type": "application/json",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then(() => {
          location.reload();
        })
        .catch((error) => console.log(error));
    },
  },

  mounted() {
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
