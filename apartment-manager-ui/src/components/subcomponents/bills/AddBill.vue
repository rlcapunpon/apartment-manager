<template>
  <div class="add-bill">
    <div class="bill-form">
      <span class="form-title">New Bill</span>
      <form class="form" @submit.prevent="handleSubmit">
      <table>
        <th></th>
        <tr><td class="label">Type:</td><td class="input">
          <select v-model="input.type">
            <option value="0">Water</option>
            <option value="1">Electricity</option>
            <option value="2">Miscellaneous</option>
          </select>
         </td></tr>
        <tr class="form-group">
          <td class="label">Amount:</td>
          <td class="input">
            <input type="number" name="amount" v-validate="{ required: true, min_value: 1 }" v-model="input.amount">
            <div v-if="submitted && errors.has('amount')" class="invalid-feedback">Amount is required.</div>
          </td>
        </tr>
        <tr class="form-group">
          <td class="label">Due Date:</td>
          <td class="input">
            <input type="date" name="duedate" v-validate="{ required: true }" v-model="input.duedate">
            <div v-if="submitted && errors.has('duedate')" class="invalid-feedback">Due Date is required.</div>
          </td>
        </tr>
        <tr class="form-group">
          <td class="label">Remarks:</td>
          <td class="input">
            <input type="text" name="remarks" v-validate="{ required: true }" v-model="input.remarks">
            <div v-if="submitted && errors.has('remarks')" class="invalid-feedback">Remark is required.</div>
          </td>
        </tr>
      </table>
      <div class="form-buttons">
        <button>Save</button>
        <button v-on:click="closePanel()">Cancel</button>
      </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddBill',
  props: ['apartmentId'],
  data () {
    return {
      input: {
        apartmentId: this.apartmentId,
        type: 2,
        amount: 0,
        remarks: '',
        duedate: new Date(),
        paid: false
      },
      submitted: false
    }
  },
  computed: {
    ...mapState('bills', ['status'])
  },
  methods: {
    ...mapActions('bills', ['addBill']),
    handleSubmit (e) {
      console.log('handling submit')
      this.submitted = true
      this.$validator.validate().then(valid => {
        if (valid) {
          console.log(this.input)
          this.addBill(this.input)
          this.$emit('addSuccess')
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
.bill-form {
  margin-top: 20%;
  height: 80%;
}

.add-bill table {
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

.add-bill span {
  color: green;
}

.add-bill-input span {
  font-size: 12px;
  color: black;
}

input, select {
  width: 100%;
  max-width: 400px;
  border-radius: 5px;
  border: 1px solid gray;
  padding: 4px;
  margin: 4px;
}

select {
  width: auto;
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