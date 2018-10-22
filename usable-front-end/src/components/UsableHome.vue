<template>
    <v-layout id="main-section" wrap align-content-center>
      <v-flex xs12>
        <h1 class="text-sm-center display-1 font-weight-medium">A testing platform to enhance your <span style="text-decoration: underline;">User's Experience</span></h1>
      </v-flex>

      <v-flex xs12 class="text-sm-center">
        <input 
          class="mt-4" 
          type="text" 
          placeholder="Enter Site Link..."
          v-model="urlInput">
        <transition name="fade">
        <v-btn 
          class="d-block ma-auto mt-3 pl-5 pr-5" 
          round color="cyan" 
          @click="componentChange"
          v-if="continueButton">CONTINUE<i class="ml-2 fas fa-chevron-right"></i></v-btn></transition>
        <p class="pt-5">New to <span class=" font-italic font-weight-medium">usable</span>? <span style="text-decoration: underline;" class="learn">Click Here</span> to learn how to use the platform!</p>
      </v-flex>
    </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        continueButton: false,
        urlInput: ''
      }
    },
    props: ['selectedComponent'],
    methods: { 
        componentChange() {
        this.selectedComponent = 'UsableForm';
        this.$emit('changeComponent', this.selectedComponent);
      }
    },
    watch: {
      urlInput() {
        if(this.urlInput.length > 5) {
          this.continueButton = true;
        }
      }
    }
  }


</script>

<style scoped>
  #main-section {
    height: 100%;
  }

  input {
    border: 2px solid white;
    border-radius: 50px;
    padding: 10px 20px;
    width: 50%;
    background: rgb(14, 18, 20);
  }

  .learn:hover {
  color: #00bcd4;
  cursor: pointer;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  }
</style>
