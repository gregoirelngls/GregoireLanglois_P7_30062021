<template>
  <div id="iconsThumbs">
    <button>
      <i
        @click.prevent="likeMessage"
        class="fas fa-thumbs-up"
        aria-hidden="true"
      ></i>
    </button>
    {{ totallike }}
    <button>
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
    };
  },
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
        .catch((aie) => console.log(aie));
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

#iconsThumbs i {
  margin: 3%;
}

.fa {
  color: rgb(255, 75, 75);
  cursor: pointer;
}

.fa:hover {
  color: rgb(182, 0, 0);
  cursor: pointer;
}

.fas {
  cursor: pointer;
  color: rgb(0, 189, 0);
}

.fas:hover {
  color: rgb(0, 104, 0);
}
</style>
