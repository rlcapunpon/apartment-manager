<template>
  <div>
    <div v-if="editing" class="edit-details-back"  v-on:click="closeDetails()">
      <span id="close-edit">close</span>
    </div>
    <div v-if="editing" class="apartment-details">
      <div>
        <table>
          <tr>
              <td colspan="2">
                <p>{{apartment.name}}</p>
              </td>
          </tr>
          <tr>
            <td>
              Status:
            </td>
            <td>
              <div v-if="isOccupied()" class="red-colored-label">OCCUPIED</div>
              <div v-else class="green-colored-label">VACANT</div>
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
              <div class="details"><pre>{{apartment.details}}</pre></div>
            </td>
        </tr>
        </table>
        <div class="set-due-date" v-if="settingDueDate">
          Due Date: <input type="date" v-model="apartment.duedate">
          <button v-on:click="saveDueDate">Save</button>
          <button v-on:click="closeSetDueDate">Cancel</button>
        </div>
      </div>

      <tenant-details :apartmentId="apartment._id" :occupied="apartment.occupied" v-on:hasTenant="occupy"></tenant-details>
      <bills-table :apartmentId="apartment._id"  v-on:updated="update"></bills-table>
      
      <div class="action-buttons">
        <button v-on:click="showAddBill()">Add Bill</button>
        <button v-if="isOccupied()" v-on:click="removeTenant()">Remove Tenant</button>
        <button v-else v-on:click="showAddTenant()">Add Tenant</button>
        <button v-if="!settingDueDate" v-on:click="showSetDueDate">Set Due Date</button>
        <button v-if="!isOccupied()" v-on:click="markAsOccupied()">Mark as Occupied</button>
        <button v-if="isOccupied()" v-on:click="markAsVacant()">Mark as Vacant</button>
      </div>

    </div>
    <add-tenant class="add-tenant" :apartmentId="apartment._id" v-if="addingTenant" v-on:hasTenant="occupy" v-on:closeComponent="closeAddTenant"></add-tenant>
    <add-bill class="add-bill" :apartmentId="apartment._id" :apartmentName="apartment.name" v-if="addingBill" v-on:updated="update" v-on:addSuccess="billed" v-on:closeComponent="closeAddBill"></add-bill>

    <div v-if="!deleted" class="apartment-unit" v-bind:class="{ forDelete: deleting }">
      <div class="display-image" v-on:click="openDetails()">
        <img v-bind:src="apartment.diplayPhotoLink" />
      </div>
      <div class="properties" v-on:click="openDetails()">
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
        </div>
        <div v-if="isOccupied()">
          <div class="status-label red-colored-label">OCCUPIED</div>
        </div>
        <div v-if="deleting">
          <button v-on:click="deleteUnit()" class="red-colored-button">DELETE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TenantDetails from '../tenant/TenantDetails.vue'
import AddTenant from '../tenant/AddTenant.vue'
import BillsTable from '../bills/BillsTable.vue'
import AddBill from '../bills/AddBill.vue'
export default {
  name: 'ApartmentDetails',
  props: ['apartment', 'deleting'],
  data () {
    return {
      deleted: false,
      editing: false,
      addingTenant: false,
      addingBill: false,
      settingDueDate: false,
      hasTenant: false,
      hasBill: false
    }
  },
  created () {
  },
  methods: {
    ...mapActions('apartments', {
      changeStatus: 'changeStatus',
      deleteApartment: 'delete',
      update: 'update'
    }),
    ...mapActions('tenants', {
      deleteTenant: 'delete'
    }),
    markAsOccupied () {
      console.log('will change occupation from: ' + this.apartment.occupied + ' to true')
      this.apartment.occupied = true
      this.changeStatus(this.apartment._id)
      this.update()
    },
    markAsVacant () {
      console.log('will change occupation from: ' + this.apartment.occupied + ' to false')
      this.apartment.occupied = false
      this.changeStatus(this.apartment._id)
      this.update()
    },
    isOccupied () {
      return this.apartment.occupied === true
    },
    occupy () {
      this.hasTenant = true
      this.markAsOccupied()
    },
    billed () {
      this.hasBill = true
    },
    deleteUnit () {
      if (confirm('Are you sure you want to delete this item?')) {
        this.deleteApartment(this.apartment._id)
        this.deleted = true
      }
    },
    openDetails () {
      this.editing = true
      this.$emit('selected')
    },
    closeDetails () {
      if (!this.addingTenant && !this.addingBill) {
        this.editing = false
        this.$emit('close')
      }
    },
    removeTenant () {
      this.markAsVacant()
      // this.deleteTenant()
    },
    showAddBill () {
      this.addingBill = true
    },
    closeAddBill () {
      this.addingBill = false
    },
    showAddTenant () {
      this.addingTenant = true
    },
    closeAddTenant () {
      this.addingTenant = false
    },
    showSetDueDate () {
      this.settingDueDate = true
    },
    saveDueDate () {
      this.settingDueDate = false
    },
    closeSetDueDate () {
      this.settingDueDate = false
    },
    update () {
      console.log('received an update')
      this.$router.go()
      this.openDetails()
    }
  },
  components: {
    'tenant-details': TenantDetails,
    'bills-table': BillsTable,
    'add-tenant': AddTenant,
    'add-bill': AddBill
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
  min-height: 383px;
  max-height: 383px;
  border: 2px solid white;
}

.apartment-unit:hover {
  border: 2px solid #026900;
  cursor: pointer;
}

.forDelete {
  max-height: 430px;
  min-height: 430px;
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

.details pre {
  overflow-x: hidden;
  width: inherit;
  max-width: 500px;
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
  background: #026900;
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

.edit-details-back {
  background: #026900;
  z-index: 99;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  opacity: 0.96;
}

.apartment-details, .add-tenant, .add-bill {
  position: fixed;
  z-index: 99;
  background: white;
  width: 60%;
  min-height: 80%;
  padding-bottom: 15px;
  margin-left: 20%;
  border-radius: 10px;
  border: 2px solid green
}

.apartment-details table {
  width: 90%;
  margin: 5%;
}

.action-buttons {
  float: right;
  margin-right: 5%;
}

#close-edit {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
}

#close-edit:hover {
  cursor: pointer;
  text-decoration: underline;
}

.set-due-date {
  padding: 10px;
  border: 1px dotted gray;
  margin-bottom: 20px;
}

.set-due-date input {
  padding: 2px;
  border-radius: 5px;
  margin-right: 11px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
