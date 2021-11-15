<template>
  <div id="iconsThumbs">
    <button aria-label="Thumbs up">
      <i
        @click="incrementLike()"
        class="fas fa-thumbs-up"
        aria-hidden="true"
      ></i>
    </button>
    {{ totallike }}
    <button aria-label="Thumbs down">
      <i
        @click.prevent="dislikeMessage"
        class="fa fa-thumbs-down"
        aria-hidden="true"
      ></i>
    </button>
    {{ totaldislike }}
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Thumbs",
  props: ["message"],
  data() {
    return {
      totalLike: 0,
      totaldislike: 0,
    };
  },
  computed: {},
  methods: {
    incrementLike: function() {
      // pas d'accès au "this" car nous sommes dans un sous élement, on créer donc une constante "self" qu reprend l'élement "this".
      const self = this;
      this.$store
        .dispatch("incrementLike", {
          message: this.message,
          // Une fois que la connexion s'est bien effectué, on passe dans le".then", et on affiche le mur avec les messages de tous les utilisateurs.
        })
        .then(
          function(response) {
            console.log("hellllo", response);
            self.$router.push("/messages");
          },
          function(error) {
            console.log(error);
          }
        );
    },

    dislikeMessage() {
      this.totaldislike -= 1;
      axios
        .post(
          "http://localhost:3000/api/messages/vote/dislike/" + this.message.id,
          {
            headers: {
              "content-type": "application/json",
              Authorization:
                "Bearer " + JSON.parse(localStorage.getItem("user")).token,
            },
          }
        )
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
#iconsThumbs {
  width: 50%;
  align-self: center;
  padding: 3%;
}

button {
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  outline-style: none;
}

#Up {
  color: green;
}

#Down {
  color: red;
}

.active {
  filter: grayscale(0%);
}

#iconsThumbs i {
  margin: 3%;
}
</style>
