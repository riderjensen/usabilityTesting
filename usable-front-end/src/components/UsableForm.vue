<template>
  <v-container>
    <v-layout class="text-xs-center">
      <v-flex xs12>
        <h1 class="grey--text darken-4 display-2 font-weight-light pb-3 pt-5">Create Tasks</h1>
        <p class="grey--text darken-4">Add custom tasks to have your Testers accomplish to get more data to help you better your sites navigation and usability. Press the (+) icon to add more than one task. <br><strong class="red--text">A MAXIMUM OF 5 TASKS MAY BE USED</strong></p>
        <hr class="mb-5">
          <v-form class="text-xs-left">
            <ul>
              <li v-for="(task, i) in tasks" :key="i">
                <h2 class="cyan--text">Task {{ i + 1 }}</h2>
                <v-textarea
                label="Task 1"
                box
                color="cyan"
                name=""
                placeholder="Enter your task here..."
              ></v-textarea>
              </li>
          <hr>
          <p class="text-xs-center mt-3"><i @click="addTask" class="fas fa-plus-circle fa-2x green--text"></i></p>
            </ul>

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
        {taskItem: 'first task here'}
      ]
    }
  },
  methods: {
    addTask() {
      const taskItem = document.querySelector('li')
      let newTaskItem = taskItem.cloneNode(true);
      this.tasks.push(newTaskItem);
      console.log(this.tasks);
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
