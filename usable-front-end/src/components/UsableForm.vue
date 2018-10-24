<template>
  <v-container>
    <v-layout class="text-xs-center">
      <v-flex xs12>
        <h1 class="grey--text darken-4 display-2 font-weight-light pb-3 pt-5">Create Tasks</h1>
        <p class="grey--text darken-4">Add custom tasks to have your Testers accomplish to get more data to help you better your sites navigation and usability. Press the (+) icon to add more than one task. <br><strong class="red--text">A MAXIMUM OF 5 TASKS MAY BE USED</strong></p>
        <hr class="mb-5">
          <v-form class="text-xs-left mb-5">
            <ul>
              <li v-for="(task, i) in tasks" :key="i" class="list-item">
                <h2 class="cyan--text mt-3">Task {{ i + 1 }}</h2>
                <v-textarea
                box
                color="cyan"
                name=""
                placeholder="Enter your task here..."
              ></v-textarea>
              </li>
            </ul>
              <hr>
          <i @click="addTask" class="mt-3 fas fa-plus-circle fa-2x green--text d-block text-xs-center"></i>
          <v-alert
            class="mt-3 black--text"
            :value="alert"
            type="warning"
            transition="scale-transition"
          > You may only have a maximum of <strong>5</strong> tasks.
          </v-alert>
            <p class="text-xs-center grey--text darken-4 mt-5">Submit tasks then receive a new link that you will send to your testers.</p>
            <v-btn
          class="d-block mt-3 ma-auto pl-5 pr-5" 
          round color="cyan">SUBMIT TASKS</v-btn>
          </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        {}
      ],
      alert: false
    }
  },
  methods: {
    addTask(i) {
      if(this.tasks.length < 5){
        const taskItem = document.querySelector('li')
        let newTaskItem = taskItem.cloneNode(true);
        this.tasks.push(newTaskItem);
      } else {
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
        }, 5000);
      }
    }
  }
}
</script>

<style scoped>
  .fas:hover {
    opacity: .8;
    cursor: pointer;
    transition: opacity .2s;
  }
</style>
