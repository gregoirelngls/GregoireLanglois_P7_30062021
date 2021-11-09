<template>
  <div id="iconsThumbs">
    <button aria-label="Thumbs up">
      <i
        @click.prevent="likeMessage"
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
      totallike: 0,
      totaldislike: 0,
      alReadyLiked: false,
      alReadyDisliked: false,
    };
  },
  computed: {},
  methods: {
    likeMessage() {
      this.totallike += 1;
      axios.defaults.headers["Authorization"] =
        "Bearer " + JSON.parse(localStorage.getItem("user")).token;
      axios
        .post(
          "http://localhost:3000/api/messages/vote/like/" + this.message.id,
          {
            headers: {
              ContentType: "application/json",
            },
          }
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
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
