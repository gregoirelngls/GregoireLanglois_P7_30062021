<template>
  <nav>
    <div class="nav-container">
      <div id="logo">
        <img src="../assets/logo.png" alt="logo groupomania" />
      </div>

      <ul id="icons">
        <li class="nav-barre">
          <router-link
            class="routerLink"
            to="/messages"
            aria-label="message sur le mur"
          >
            <i class="fas fa-comments" aria-hidden="true"> </i>
          </router-link>
        </li>

        <li class="nav-barre">
          <router-link
            class="routerLink"
            to="/user"
            aria-label="Gestion du compte utilisateur"
          >
            <i class="fas fa-user" aria-hidden="true"></i>
          </router-link>
        </li>

        <li class="nav-barre">
          <router-link
            class="routerLink"
            to="/About"
            aria-label="A propos de groupomania"
          >
            <i class="fas fa-question-circle" aria-hidden="true"></i>
          </router-link>
        </li>
      </ul>
      <router-view />
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
#logo {
  width: 100%;
}

nav {
  background-color: white;
  margin-bottom: 2%;
}

.nav-container {
  position: relative;
  top: 0em;
  display: flex;
  flex-direction: row;
  padding: 1%;
}

#icons {
  list-style: none;
  color: rgb(255, 122, 122);
  display: flex;
  padding-left: 0;
  margin-bottom: 0;
  padding-right: 3%;
  font-size: 1.8em;
  text-decoration: none;
}

#icons i {
  color: rgb(24, 124, 122);
  text-decoration: none;
  font-size: 3vw;
}

.nav-barre {
  padding-right: 1em;
}

#icons li :hover {
  color: rgb(0, 51, 36);
}
</style>
