<template>
  <div id="login">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <div v-show="submitted && !username" class="invalid-feedback">Username is required</div>
        <input type="text" v-model="username" name="username" class="form-control" :class="{ 'is-invalid': submitted && !username }" placeholder="Username" />
      </div>
      <div class="form-group">
        <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
        <input type="password" v-model="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" placeholder="Password" />
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="status.loggingIn">Login</button>
        <img v-show="status.loggingIn" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
      </div>
    </form>
    <br/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      username: '',
      password: '',
      submitted: false
    }
  },
  computed: {
    ...mapState('account', ['status'])
  },
  created () {
    // reset login status
    this.logout()
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),
    handleSubmit (e) {
      this.submitted = true
      const { username, password } = this
      if (username && password) {
        var user = this.login({ username, password })
        if (user) {
          // localStorage.setItem('user', JSON.stringify(user))
          console.log('There is a user.')
          this.$router.replace({ name: 'home' })
        }
      }
      this.password = ''
      this.submitted = false
    }
  }
}
</script>

<style scoped>
#login {
  background-color: #ffffff;
  margin: auto;
  padding: 20px;
}

input {
  width: 24%;
  margin-left: 38%;
  margin-right: 38%;
  margin-bottom: 6px;
  height: 32px;
  border: 1px solid gray;
  border-radius: 7px;
  padding: 2px;
  text-align: center;
  outline: none;
}

input.valid {
  border: 1px solid gray;
}

.is-invalid {
  border-color: red;
}

.invalid-feedback {
  color: red;
  font-size: 10px;
  margin-top: 1px;
  margin-bottom: 5px;
}

button {
  width: 130px;
  height: 30px;
  border-radius: 5px;
  border: none;
  color: white;
  background: #026900;
  margin-top: 14px;
}

button:hover {
  cursor: pointer;
  background: green;
}
</style>