<template>
  <div id="createMessage">
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
          ROWS="2"
          COLS="5"
          v-model="content"
        ></textarea>
        <label for="file" class="label"> </label>
        <input
          name="attachment"
          ref="file"
          type="file"
          class="tag files"
          id="inputFile"
          aria-describedby="inputFileAddon"
          @change="onFileChange"
        />
        <button type="submit" class="tag button-send">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateMessage",
  components: {},

  data() {
    return {
      content: "",
      attachment: "",

      errorMsg: "",
      userId: localStorage.getItem("userId"),
      token: localStorage.getItem("token"),
    };
  },

  methods: {
    onFileChange(e) {
      const attachment = e.target.files[0];
      this.attachment = attachment;
    },

    sendMessage(e) {
      e.preventDefault();
      const fd = new FormData();
      fd.append("file", this.attachment);
      fd.append("content", this.content);
      let self = this;
      axios
        .post("http://localhost:3000/api/message/create", fd, {
          headers: {
            ContentType: "multipart/form-data",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then(function() {
          alert("Votre message a bien été créé !");
          location.reload();
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
  border: 3px solid rgb(4, 4, 122);
  border-radius: 10px;
}

textarea:focus {
  outline: none;
}

h1 {
  font-size: 4vw;
  text-align: center;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  margin: 0;
}

form {
  display: flex;
  flex-direction: column;
}

.tag {
  margin-top: 2%;
  background-color: antiquewhite;
  font-size: 2vw;
}

.button-send {
  border-radius: 2em;
  font-family: impact;
  width: 20%;
  font-size: 2vw;
  margin: 2%;
}

.button-send:focus {
  outline: none;
}

.files {
  font-family: impact;
}
</style>
