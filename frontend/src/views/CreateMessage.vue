<template>
  <div id="createMessage">
    <Header />
    <div class="formulaireType">
      <h1>Nouveau message</h1>
      <form
        enctype="multipart/form-data"
        method="post"
        id="myForm"
        class="formulaire"
        @submit.prevent="sendMessage"
      >
        <textarea
          class="tag area"
          name="content"
          ROWS="5"
          COLS="50"
          v-model="content"
        ></textarea>
        <label for="file" class="label"> Upload File </label>
        <input
          name="attachment"
          ref="file"
          type="file"
          class="tag files"
          id="inputFile"
          aria-describedby="inputFileAddon"
          @change="onFileChange"
        />
        <button type="submit" class="tag button">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
//import { mapState } from "vuex";
import Header from "../components/Header";

export default {
  name: "CreateMessage",
  components: {
    Header,
  },

  data() {
    return {
      content: null,
      attachment: null,

      errorMsg: "",
    };
  },

  methods: {
    onFileChange(e) {
      const attachment = e.target.files[0];
      this.attachment = attachment;
    },

    sendMessage(e) {
      e.preventDefault();
      console.log("est ce que ça marche ?");
      const fd = new FormData();
      fd.append("attachment", this.attachment);
      fd.append("content", this.content);
      console.log("test récup", fd.get("attachment"));
      console.log("test récup", fd.get("content"));
      let self = this;
      axios
        .post("http://localhost:3000/api/message/create", this.content, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then(function() {
          alert("Votre message a bien été créé !");
          self.$router.push("/messages");
        })
        .catch(function() {
          alert("Il semblerait y avoir un problème, reessayer plutard");
          self.$router.push("/createmessage");
          location.reload();
        });
    },
  },
};
</script>

<style>
#createMessage {
  width: 100%;
  height: auto;
}

.formulaireType {
  flex-direction: column;
  width: 60%;
  justify-content: center;
  background-color: white;
  margin: 0 auto;
  position: absolute;
  top: 25%;
  left: 20%;
  padding: 3%;
  border-radius: 1em;
  border: 2px solid #343a40;
}

h1 {
  font-size: 4vw;
  text-align: center;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
}

form {
  display: flex;
  flex-direction: column;
}

.tag {
  margin-top: 2%;
  background-color: antiquewhite;
}

.button {
  border-radius: 2em;
  font-family: impact;
}

.files {
  font-family: impact;
}
</style>
