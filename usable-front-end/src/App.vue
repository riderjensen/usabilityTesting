<template>
  <v-app id="usable-home" dark>
    <v-container fluid>
      <!-- Navbar -->
      <usable-navbar />
      <!-- Main Section  -->
      <transition name="component-fade" mode="out-in">
      <component :is="selectedComponent" @changeComponent="selectedComponent = $event"></component>
      </transition>
      <!-- Footer -->
      <usable-footer />
     
    </v-container>
  </v-app>
    

</template>

<script>
import UsableHome from "./components/UsableHome";
import UsableNavbar from "./components/UsableNavbar";
import UsableFooter from "./components/UsableFooter";
import UsableForm from "./components/UsableForm";

export default {
  name: "App",
  components: {
    UsableHome,
    UsableNavbar,
    UsableFooter,
    UsableForm
  },
  data() {
    return {
      selectedComponent: "UsableHome"
    };
  }
};
</script>

<style scoped>
#usable-home {
  background-image: url("./assets/background.png");
  background-size: cover;
  display: block;
}

.container {
  padding: 0;
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
