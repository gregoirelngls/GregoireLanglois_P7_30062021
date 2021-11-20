<template>
  <div id="iconsThumbs">
    <button aria-label="Thumbs up" @click.prevent="likeMessage">
      <i
        class="fas fa-thumbs-up"
        aria-hidden="true"
        :class="{ active: isActiveUp }"
        @click="isActiveUp = !isActiveUp"
      ></i>
    </button>
    {{ totalLike }}

    <button aria-label="Thumbs down" @click.prevent="dislikeMessage">
      <i
        class="fa fa-thumbs-down"
        aria-hidden="true"
        :class="{ active: isActiveDown }"
        @click="isActiveDown = !isActiveDown"
      ></i>
    </button>
    {{ totalDislike }}
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
      totalDislike: 0,
      isActiveDown: false,
      isActiveUp: false,
    };
  },
  computed: {},
  methods: {
    likeMessage() {
      this.totalLike += 1;
      axios.defaults.headers["Authorization"] =
        "Bearer " + JSON.parse(localStorage.getItem("user")).token;
      axios
        .post(
          "http://localhost:3000/api/messages/vote/like/" + this.message.id,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    },

    dislikeMessage() {
      this.totaldislike -= 1;
      axios.defaults.headers["Authorization"] =
        "Bearer " + JSON.parse(localStorage.getItem("user")).token;
      axios
        .post(
          "http://localhost:3000/api/messages/vote/dislike/" + this.message.id,
          {
            headers: {
              "content-type": "application/json",
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

i #iconsThumbs i {
  margin: 3%;
}

.fa {
  color: red;
}

.fas {
  color: green;
}

i {
  filter: grayscale(100%);
}

.active {
  filter: grayscale(0%);
}
</style>
