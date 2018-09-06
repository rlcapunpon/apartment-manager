<template>
  <div class="add-tenant">
    <div class="tenant-form">
      <span class="form-title">New Tenant</span>
      <form class="form" @submit.prevent="handleSubmit">
      <table>
        <th></th>
        <tr class="form-group">
          <td class="label">Name:</td>
          <td class="input">
            <input type="text" name="name" v-validate="{ required: true }" v-model="input.name">
            <div v-if="submitted && errors.has('name')" class="invalid-feedback">Name is required.</div>
          </td>
        </tr>
        <tr class="form-group">
          <td class="label">Contact No:</td>
          <td class="input">
            <input type="text" name="contact" v-validate="{ required: true }" v-model="input.contact">
            <div v-if="submitted && errors.has('contact')" class="invalid-feedback">Contact No. is required.</div>
          </td>
        </tr>
        <tr class="form-group">
          <td class="label">Email:</td>
          <td class="input">
            <input type="text" name="email" v-validate="{ required: true }" v-model="input.email">
            <div v-if="submitted && errors.has('email')" class="invalid-feedback">Email is required.</div>
          </td>
        </tr>
        <tr class="form-group">
          <td class="label">Total headcount:</td>
          <td class="input">
            <input type="number" name="headcount" v-validate="{ required: true, min_value: 1 }" v-model="input.headcount">
            <div v-if="submitted && errors.has('headcount')" class="invalid-feedback">Headcount is required.</div>
          </td>
        </tr>
      </table>
      <div class="form-buttons form-group">
        <button class="btn btn-primary" :disabled="status.registering">Save</button>
        <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        <button v-on:click="closePanel()">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddTenant',
  props: ['apartmentId'],
  data () {
    return {
      input: {
        apartmentId: this.apartmentId,
        name: '',
        contact: '',
        email: '',
        headcount: 0
      },
      submitted: false
    }
  },
  computed: {
    ...mapState('tenants', ['status'])
  },
  methods: {
    ...mapActions('tenants', ['addTenant']),
    handleSubmit (e) {
      console.log('handling submit')
      this.submitted = true
      this.$validator.validate().then(valid => {
        if (valid) {
          console.log(this.input)
          this.addTenant(this.input)
          this.$emit('hasTenant')
          this.$emit('closeComponent')
        }
      })
    },
    closePanel () {
      this.$emit('closeComponent')
    }
  }
}
</script>

<style>
.tenant-form {
  margin-top: 20%;
  height: 80%;
}

.add-tenant table {
  margin-top: 40px;
  width: 60%;
  margin-left: 20%;
  margin-bottom: 40px;
}

td.label {
  width: 25%;
}

td.input {
  width: 75%;
}

.add-tenant span {
  color: green;
}

.add-tenant-input span {
  font-size: 12px;
  color: black;
}

input {
  width: 100%;
  max-width: 400px;
  border-radius: 5px;
  border: 1px solid gray;
  padding: 4px;
  margin: 4px;
}

.form-buttons {
  width: 80%;
  margin-left: 10%;
}

.is-invalid {
  border-color: red;
}

.invalid-feedback {
  color: red;
  font-size: 10px;
  margin-top: 0px;
  margin-bottom: 5px;
}
</style>