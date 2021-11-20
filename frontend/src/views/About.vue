<template>
  <div id="app">
    <Header />
    <h1>
      Groupomania est un reseau social d'entreprise
    </h1>
    <p class="paragraphe">
      Si vous rencontrez un problème technique, n'hésitez pas à solliciter
      Grégoire Langlois, administrateur du réseau Groupomania. E-mail:
      admin@admin.fr
    </p>
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "About",
  components: {
    Header,
  },
};
</script>

<style>
.paragraphe {
  justify-content: center;
  display: flex;
  margin-top: 10%;
  font-size: 2em;
  font-weight: bold;
  margin: 5%;
}
</style>
