<template>
  <div v-if="!deleted" class="apartment-unit" v-bind:class="{ forDelete: deleting }">
    <div class="display-image">
      <img v-bind:src="apartment.diplayPhotoLink" />
    </div>
    <div class="properties">
      <table>
      <tr>
          <td colspan="2">
            <p>{{apartment.name}}</p>
          </td>
        </tr>
        <tr>
          <td>
            Rate:
          </td>
          <td>
            {{apartment.rate}}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            Details:
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="details">{{apartment.details}}</div>
          </td>
        </tr>
      </table>
    </div> 
    <div class="footer">
      <div v-if="!isOccupied()">
        <div class="status-label green-colored-label">VACANT</div>
        <button v-on:click="markAsOccupied()">Mark as Occupied</button>
      </div>
      <div v-if="isOccupied()">
        <div class="status-label red-colored-label">OCCUPIED</div>
        <button class="red-colored-button" v-on:click="markAsVacant()">Mark as Vacant</button>
      </div>
      <div v-if="deleting">
        <button v-on:click="deleteUnit()" class="red-colored-button">DELETE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ApartmentDetails',
  props: ['apartment', 'deleting'],
  data () {
    return {
      deleted: false
    }
  },
  created () {
  },
  methods: {
    ...mapActions('apartments', {
      changeStatus: 'changeStatus',
      deleteApartment: 'delete'
    }),
    markAsOccupied () {
      console.log('will change occupation from: xx' + this.apartment.occupied + 'xx to true')
      this.apartment.occupied = true
      this.changeStatus(this.apartment._id)
    },
    markAsVacant () {
      console.log('will change occupation from: ' + this.apartment.occupied + ' to false')
      this.apartment.occupied = false
      this.changeStatus(this.apartment._id)
    },
    isOccupied () {
      return this.apartment.occupied === true
    },
    deleteUnit () {
      if (confirm('Are you sure you want to delete this item?')) {
        this.deleteApartment(this.apartment._id)
        this.deleted = true
      }
    }
  }
}
</script>

<style>
.apartment-unit {
  float: left;
  margin: 10px;
  overflow: hidden;
  width: 180px;
  background: #f9f9f9;
  border: 1px solid gray;
  border: none;
  color: #676767;
  border-radius: 5px;
  -webkit-box-shadow: 1px 3px 16px grey;
  box-shadow: 1px 3px 16px grey;
  font-size: 14px;
  padding-bottom: 10px;
  min-height: 430px;
  max-height: 430px;
}

.forDelete {
  max-height: 490px;
  min-height: 490px;
}

table {
  width: 85%;
  margin: 10%;
  margin-top: 0px;
  text-align: left;
}

table tr:first-child {
  text-align: center;
  font-weight: bold;
}

td:first-child {
  width: 45%;
  word-break: break-all;
}

.details {
  max-height: 100px;
  overflow-y: auto;
}

.display-image img {
  width: 100%;
  max-height: 130px;
}

button {
  width: 130px;
  min-width: 130px;
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

.red-colored-button {
  background: red;
}

.red-colored-button:hover {
  background: darkred;
  border-color: darkred;
}

.status-label {
  padding-top: 10px;
  width: 100%;
  text-align: center;
  border-top: 1px solid;
}

.red-colored-label {
  color: red;
}

.green-colored-label {
  color: #026900;
}

p {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: keep-all;
}

.properties {
  min-height: 206px;
  max-height: 206px;
}
</style>
