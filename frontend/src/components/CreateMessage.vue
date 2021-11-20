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
        <div id="textarea">
          <label class="label" for="form">Tell us your story:</label>
          <textarea
            id="form"
            class="tag area"
            name="content"
            ROWS="3"
            COLS="5"
            v-model="content"
            required="required"
          ></textarea>
        </div>
        <div class="uploadfiles">
          <label for="inputFile" class="label"> Choisissez votre fichier</label>
          <input
            name="attachment"
            ref="file"
            type="file"
            class="tag files"
            id="inputFile"
            aria-label="inputFileAddon"
            @change="onFileChange"
          />
        </div>
        <button id="submit" type="submit" class="tag button-send">
          Envoyer
        </button>
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
  width: 50%;
  background-color: white;
  margin: 0 auto;
  border: 3px solid rgb(4, 4, 122);
  border-radius: 15px;
}

textarea:focus {
  outline: none;
}

h1 {
  text-align: center;
  font-family: Impact, "Arial Narrow Bold", sans-serif;
  margin: 0;
  padding-top: 2%;
  font-size: 2.7vw;
}

form {
  display: flex;
  flex-direction: column;
}

.tag {
  margin-top: 2%;
  background-color: antiquewhite;
  font-size: 2vw;
  width: 100%;
}

.button-send {
  border-radius: 2em;
  font-family: impact;
  width: 20%;
  font-size: 1.5vw;
  margin: 2%;
}

.button-send:focus {
  outline: none;
}

.files {
  font-family: impact;
}

#inputFile {
  font-size: 1.5vw;
}

.label {
  display: none;
}

@media (min-width: 1200px) {
  .formulaireType {
    width: 35%;
  }
}

@media (max-width: 670px) {
  .formulaireType {
    width: 80%;
  }
}
</style>
