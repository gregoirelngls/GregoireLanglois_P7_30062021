<template>
  <Header />
  <div id="modifPost">
    <div class="modifFormulaireType">
      <h1>Vous pouvez désormais modifier votre message</h1>
      <form
        enctype="multipart/form-data"
        id="myForm"
        class="formulaire"
        @submit.prevent="updateMessage"
      >
        <label for="input_text"></label>
        <textarea
          id="message"
          type="text"
          class="tag area"
          name="content"
          ROWS="2"
          COLS="5"
          v-bind:placeholder="message.content"
          v-model="message.content"
        ></textarea>
        <label for="file" class="label"></label>
        <input
          name="attachment"
          ref="file"
          type="file"
          class="tag files"
          id="inputFile"
          aria-describedby="inputFileAddon"
          @change="onFileChange"
        />

        <div class="btn modifPost">
          <button id="modify" type="submit" class="tag button-send">
            Modifier
          </button>
          <router-link class="routerLink" to="/messages">
            <button id="cancel" type="submit" class="tag button-send">
              Annuler
            </button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "../components/Header";

export default {
  name: "Edit",
  components: {
    Header,
  },
  data() {
    return {
      id: this.$route.params.id,
      message: {
        content: "",
        attachment: "",
      },
    };
  },
  mounted: function() {
    this.getOneMessage();
  },
  methods: {
    onFileChange(e) {
      const attachment = e.target.files[0];
      this.message.attachment = attachment;
    },

    getOneMessage() {
      axios.defaults.headers["Authorization"] =
        "Bearer " + JSON.parse(localStorage.getItem("user")).token;
      axios
        .get("http://localhost:3000/api/message/edit/" + this.id)
        .then((response) => {
          console.log(response.data);
          let data = response.data;
          this.message.content = data.content;
          this.message.attachment = data.attachment;
        })
        .catch((error) => {
          this.data = alert("erreur, rien a afficher !");
          console.log("pas bien" + error);
        });
    },

    updateMessage(e) {
      e.preventDefault();
      axios.defaults.headers["Authorization"] =
        "Bearer " + JSON.parse(localStorage.getItem("user")).token;
      const fd = new FormData();
      fd.append("file", this.message.attachment);
      fd.append("content", this.message.content);
      let self = this;
      axios
        .put("http://localhost:3000/api/message/update/" + this.id, fd, {
          headers: {
            ContentType: "multipart/form-data",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
        .then(() => {
          alert("l'article a bien été modifié");
          self.$router.replace({
            name: "wall",
          });
        })
        .catch((error) => {
          this.data = alert("erreur c'est pas encore ça !");
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
#modifPost {
  width: 50%;
  display: flex;
  justify-content: center;
  margin-left: 25%;
  padding: 3%;
  border: 1px solid black;
  background-color: white;
  border-radius: 10px;
}

h1 {
  font-size: 2vw;
}
</style>
