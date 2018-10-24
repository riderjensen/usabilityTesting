<template>
    <v-layout id="main-section" wrap align-content-center>
      <v-flex xs12>
        <h1 class="text-sm-center display-1 font-weight-medium">A testing platform to enhance your <span style="text-decoration: underline;">User's Experience</span></h1>
      </v-flex>

      <v-flex xs12 class="text-sm-center">
        <input 
          class="mt-4 urlInputBox" 
          type="text" 
          placeholder="Enter Site Link..."
          v-model="urlInput">
        <transition name="fade">
        <v-btn
          class="d-block ma-auto mt-3 pl-5 pr-5 continueBtn" 
          round color="cyan" 
          @click="componentChange"
          :disabled="urlCheck">CONTINUE<i class="ml-2 fas fa-chevron-right"></i></v-btn></transition>
        <p class="pt-5">New to <span class="font-italic font-weight-medium">usable</span>? <span style="text-decoration: underline;" class="learn">Click Here</span> to learn how to use the platform!</p>
      </v-flex>
    </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        urlInput: '',
        urlCheck: true
      }
    },
    props: ['selectedComponent'],
    methods: { 
        componentChange() {
        document.querySelector('#usable-home').style.backgroundImage = 'none';
        document.querySelector('#usable-home').style.backgroundColor = '#fff';
        document.querySelector('.navbar').style.backgroundImage = "url(/img/background.27769967.png)";
        document.querySelector('.navbar').style.backgroundSize = 'cover';
        this.selectedComponent = 'UsableForm';
        this.$emit('changeComponent', this.selectedComponent);
      }
    },
    watch: {
      urlInput() {
        let urlInputBox = document.querySelector('.urlInputBox');
        // console.log(urlInputBox.style);
        if(this.urlInput.length > 5) {
          this.urlCheck = false;
          urlInputBox.style.borderColor = 'green';
        } else {
          this.urlCheck = true;
          urlInputBox.style.borderColor = 'red';
        }
      }
    }
  }


</script>

<style scoped>
  #main-section {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 250px;
    
  }

  input {
    border: 2px solid white;
    border-radius: 50px;
    padding: 10px 20px;
    width: 50%;
    background: rgb(14, 18, 20);
    transition: all 1s;
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
