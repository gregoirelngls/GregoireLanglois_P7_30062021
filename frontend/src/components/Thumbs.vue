<template>
  <div id="iconsThumbs">
    <button id="ThumbsUp" @click="alReadyLiked = !alReadyLiked">
      <i
        :class="{ active: alReadyLiked }"
        @click.prevent="likeMessage"
        class="fas fa-thumbs-up"
        aria-hidden="true"
      ></i>
    </button>
    {{ totallike }}
    <button id="ThumbsDown">
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
  padding: 5px 10px;
  margin: 1%;
  font-size: 2.5vw;
}

button {
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  outline-style: none;
}

#ThumbsUp {
  filter: grayscale(100%);
}

.active {
  filter: grayscale(0%);
}

#iconsThumbs i {
  margin: 3%;
}
</style>
