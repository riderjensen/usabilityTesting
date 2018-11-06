<template>
  <v-container mt-5 pt-5>
    <v-layout>
      <v-flex>
        <v-card>
        <v-card-title
          class="headline grey justify-center"
          primary-title
        >
          Create an Account with <span><img class="ml-2" src="../assets/usable_logo.svg" alt=""></span>
        </v-card-title>

        <v-card-text>
          <v-layout>
            <v-flex xs12 mb-4>
              <v-text-field 
                type="text" 
                required
                v-model="email"
                label="Email"
                color="cyan"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-text-field 
              type="text" 
              v-model="password"
              required
              label="Password"
              color="cyan"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-text-field 
              type="text" 
              v-model="confirmPassword"
              required
              label="Confirm Password"
              color="cyan"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-layout class="justify-center">
          <v-btn
          style="border-radius: 20px;"
          class="pr-5 pl-5 mb-4"
          color="grey"
          @click="dialog = false"
          >
          CREATE NEW ACCOUNT
          </v-btn>
        </v-layout>
      </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }
}
</script>

