<template>
    <div id="add-apartment">
        <h2 class="form-title">Add New Apartment</h2>
        <form class="form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <br/><label for="name">Display Photo</label><br/>
            <input type="file" name="photo" @change="processFile($event)" accept="image/x-png,image/gif,image/jpeg" placeholder="Choose File" />
            <br/>or<br/>
            <input type="text" name="link" v-model="input.diplayPhotoLink" placeholder="Link to photo" />
          </div>
          <div class="form-group">
            <br/><label for="name">Apartment Name</label><br/>
            <input type="text" name="title"  v-validate="'required'" v-model="input.name" placeholder="Apartment Name" :class="{ 'is-invalid': submitted && errors.has('title') }"/>
            <div v-if="submitted && errors.has('title')" class="invalid-feedback">Apartment Name is required.</div>
          </div>
          <div class="form-group">
            <br/><label for="rate">Monthly Rate</label><br/>
            <input type="number" name="rate"  v-validate="{ required: true, min_value: 100 }" v-model="input.rate" placeholder="Monthly Rate" :class="{ 'is-invalid': submitted && errors.has('rate') }">
            <div v-if="submitted && errors.has('rate')" class="invalid-feedback">Corrent Monthly Rate is required.</div>
          </div>

          <div class="form-group">
            <br/><label for="details">Details</label><br/>
            <textarea class="details" v-model="input.details">
            </textarea>
          </div>
          <div class="form-group">
          <button type="button" v-on:click="cancel">Cancel</button>
          <button class="btn btn-primary" :disabled="status.registering">Add</button>
          <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        </div>
      </form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddApartment',
  data () {
    return {
      input: {
        name: '',
        rate: 0,
        occupied: 'false',
        diplayPhotoLink: '',
        displayPhotoFile: ''
      },
      submitted: false
    }
  },
  create () {
    this.input.diplayPhoto = {}
  },
  computed: {
    ...mapState('apartments', ['status'])
  },
  methods: {
    processFile (event) {
      this.input.displayPhotoFile = event.target.files[0]
      console.log('photo changed: ' + this.input.displayPhotoFile)
    },
    ...mapActions('apartments', ['addApartment']),
    handleSubmit (e) {
      console.log('handling submit')
      this.submitted = true
      this.$validator.validate().then(valid => {
        if (valid) {
          console.log(this.input)
          this.addApartment(this.input)
          this.$emit('closeComponent')
        }
      })
    },
    cancel () {
      this.$emit('closeComponent')
      console.log('add component closed.')
    }
  }
}
</script>

<style>
.form-title {
  margin-top: 10px;
  margin-bottom: 10px;
}

.form-item {
  margin-top: 10px;
}

.form-item label {
  float: left;
  text-align: left;
  width: 26%;
  margin-left: 30%;
  margin-right: 37%;
  margin-top: 10px;
}

input,
select {
  float: left;
  width: 40%;
  margin-left: 37%;
  margin-right: 37%;
  height: 22px;
  border-radius: 5px;
  border: 1px solid gray;
  padding-left: 1px;
}

button {
  width: 99px;
  height: 28px;
  border: none;
  background: #4e892a;
  color: white;
  border-radius: 5px;
  margin: 14px;
}

button:hover {
  cursor: pointer;
  background: forestgreen;
}

.details {
  width: 40%;
  height: 75px;
  border-radius: 6px;
  border-color: #a8a8a8;
  resize: none;
  margin: 4px;
  padding: 6px;
}

input {
  margin: 4px;
  float: none;
  padding: 6px;
}

label {
  float: left;
  color: green;
  font-size: 13px;
  margin-left: 30%;
}

.is-invalid {
  border-color: red;
}

.add-apartment {
  width: 150%;
  margin-left: -24%;
}

.invalid-feedback {
  color: red;
  font-size: 10px;
  margin-top: 0px;
  margin-bottom: 5px;
}
</style>
