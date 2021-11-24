<template>
  <div id="iconsThumbs">
    <button aria-label="Thumbs up" @click.prevent="likeMessage">
      <i
        class="fas fa-thumbs-up"
        aria-hidden="true"
        :class="{ active: isActiveUp }"
      ></i>
    </button>
    {{ totalLike }}

    <button aria-label="Thumbs down" @click.prevent="dislikeMessage">
      <i
        class="fa fa-thumbs-down"
        aria-hidden="true"
        :class="{ active: isActiveDown }"
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
      totalLike: this.message.likes,
      totalDislike: this.message.disLikes,
      isActiveDown:
        this.message.usersDisliked?.includes(
          JSON.parse(localStorage.getItem("user")).userId
        ) || false,
      isActiveUp:
        this.message.usersLiked?.includes(
          JSON.parse(localStorage.getItem("user")).userId
        ) || false,
    };
  },
  computed: {},
  methods: {
    likeMessage() {
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
        .then((response) => {
          if (response.data.code === "likeMessage") {
            this.isActiveUp = true;
            this.totalLike += 1;
            if (this.isActiveDown) {
              this.isActiveDown = false;
              this.totalDislike -= 1;
            }
          } else if (response.data.code === "noLikeMessage") {
            this.isActiveUp = false;
            this.totalLike -= 1;
          }
        })
        .catch((error) => console.log("error ===>", error.error));
    },
    dislikeMessage() {
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
        .then((response) => {
          if (response.data.code === "disLikeMessage") {
            this.isActiveDown = true;
            this.totalDislike += 1;
            if (this.isActiveUp) {
              this.isActiveUp = false;
              this.totalLike -= 1;
            }
          } else if (response.data.code === "noDislikeMessage") {
            this.isActiveDown = false;
            this.totalDislike -= 1;
          }
        })
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
