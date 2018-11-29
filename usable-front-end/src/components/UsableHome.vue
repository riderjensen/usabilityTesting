<template>
  <v-layout id="main-section" wrap align-content-center>
    <v-flex xs12>
      <h1 class="text-sm-center display-1 font-weight-medium">A testing platform to enhance your
        <span style="text-decoration: underline;">User's Experience</span>
      </h1>
    </v-flex>

    <v-flex xs12 class="text-sm-center">
      <input
        class="mt-4 urlInputBox"
        type="text"
        placeholder="Enter Site Link..."
        v-model="urlInput"
        id="webURL"
      >
      <i class="fas fa-check fa-2x"></i>
      <transition name="fade">
        <router-link to="/new-test" class="to-form-btn">
          <v-btn
            class="d-block ma-auto mt-3 pl-5 pr-5 continueBtn"
            round
            color="cyan"
            @click="leaveHomeStyles"
            :disabled="urlCheck"
          >CONTINUE
            <i class="ml-2 fas fa-chevron-right"></i>
          </v-btn>
        </router-link>
      </transition>
      <p class="pt-5">New to
        <span class="font-italic font-weight-medium">usable</span>?
        <span style="text-decoration: underline;" class="learn">Click Here</span> to learn how to use the platform!
      </p>
    </v-flex>
  </v-layout>
</template>

<script>
// const splitURL = data.split("");
// 			// check to see if they added http
// 			const addedItems = splitURL[0] + splitURL[1] + splitURL[2] + splitURL[3];
// 			if (addedItems != 'http') {
// 				data = 'http://' + data;
// 			}

export default {
  data() {
    return {
      urlInput: "",
      urlCheck: true
    };
  },
  methods: {
    leaveHomeStyles() {
      document.querySelector("#usable-home").style.backgroundImage = "none";
      document.querySelector("#usable-home").style.backgroundColor = "#fff";
      document.querySelector(".navbar").style.backgroundImage =
        "url(/img/background.27769967.png)";
      document.querySelector(".navbar").style.backgroundSize = "cover";
    }
  },
  watch: {
    urlInput() {
      const urlInputBox = document.querySelector(".urlInputBox");
      let vm = this;
       const splitURL = vm.urlInput.split("");
            // check to see if they added http
            const addedItems =
              splitURL[0] + splitURL[1] + splitURL[2] + splitURL[3];
            if (addedItems != "http") {
              vm.urlInput = "http://" + vm.urlInput;
            }
      fetch(this.urlInput, { mode: "no-cors" })
        .then(function(data) {
          console.log(data);
          setTimeout(() => {
           
            if (data.type === "opaque") {
              vm.urlCheck = false;
              urlInputBox.style.borderColor = "green";
              document.querySelector(".fa-check").style.opacity = "1";
              document.querySelector(".fa-check").style.right = "40px";
              document.querySelector(".fa-chevron-right").style.position =
                "relative";
              document.querySelector(".fa-chevron-right").style.right = "-5px";
            }
          }, 1500);
        })
        .catch(function(error) {
          vm.urlCheck = true;
          urlInputBox.style.borderColor = "red";
          document.querySelector(".fa-check").style.opacity = "0";
          document.querySelector(".fa-check").style.right = "0px";
          document.querySelector(".fa-chevron-right").style.right = "0px";
        });
    }
  }
};
</script>

<style scoped>
#main-section {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 250px;
}

a {
  text-decoration: none;
}

input {
  border: 2px solid white;
  border-radius: 50px;
  padding: 10px 20px;
  width: 50%;
  background: rgb(14, 18, 20);
  transition: all 1s;
  position: relative;
}

.learn:hover {
  color: #00bcd4;
  cursor: pointer;
}

.fa-chevron-right {
  transition: right 0.5s;
}

.fa-check {
  position: relative;
  right: 0px;
  top: 5px;
  color: green;
  opacity: 0;
  transition: all 0.5s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
