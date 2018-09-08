import { billService } from '../services'
import { router } from '../router/index'

const state = {
  all: {}, status: {}
}

const actions = {
  addBill ({ dispatch, commit }, bill) {
    commit('addRequest', bill)
    billService.add(bill)
      .then(
        bill => {
          commit('addSuccess', bill)
          router.push('/')
          console.log('trying to push to /')
          setTimeout(() => {
            // display success message after route change completes
            dispatch('alert/success', 'Bill Addition successful', { root: true })
          })
        },
        error => {
          console.log(error)
          commit('addFailure', 'Addition Failure.')
          dispatch('alert/error', 'Addition Failure.', { root: true })
        }
      )
  },
  getAll ({ commit }) {
    commit('getAllRequest')
    billService.getAll()
      .then(
        bills => commit('getAllSuccess', bills),
        error => commit('getAllFailure', error.toString())
      )
  },
  getByApartmentId ({ commit }, apartmentId) {
    commit('getByApartmentRequest')
    billService.getByApartment(apartmentId)
      .then(
        tenants => commit('getByApartmentSuccess', tenants),
        error => commit('getByApartmentFailure', error.toString())
      )
  },
  changeStatus ({ commit }, id) {
    commit('changeStatusRequest')
    router.push('/')
    billService.changeStatus(id)
      .then(
        bill => commit('changeStatusSuccess', { id, bill }),
        error => commit('changeStatusFailure', { id, error: error.toString() })
      )
  },
  delete ({ commit }, id) {
    commit('deleteRequest', id)
    router.push('/')
    billService.delete(id)
      .then(
        user => commit('deleteSuccess', id),
        error => commit('deleteSuccess', { id, error: error.toString() })
      )
  }
}

const mutations = {
  addRequest (state, bill) {
    state.status = { registering: true }
  },
  addSuccess (state, bill) {
    state.status = {}
  },
  addFailure (state, error) {
    state.status = {}
  },
  getAllRequest (state) {
    console.log('mutation for get bill request committed.')
    state.all = { loading: true }
  },
  getAllSuccess (state, bills) {
    console.log('mutation for get bill success committed.')
    state.all = { items: bills }
  },
  getAllFailure (state, error) {
    console.log('mutation for get bill failure committed.')
    state.all = { error }
  },
  getByApartmentRequest (state) {
    console.log('mutation for get bill request committed.')
    state.all = { loading: true }
  },
  getByApartmentSuccess (state, tenants) {
    console.log('mutation for get bill success committed.')
    state.all = { items: tenants }
  },
  getByApartmentFailure (state, error) {
    console.log('mutation for get bill failure committed.')
    state.all = { error }
  },
  changeStatusRequest (state, id) {
    console.log('mutation for change status request committed.')
    state.all.items = state.all.items.map(bill =>
      bill.id === id
        ? { ...bill, updating: true }
        : bill
    )
  },
  changeStatusSuccess (state, id, update) {
    console.log('mutation for change status success committed.')
    state.all.items = state.all.items.map(bill =>
      bill.id === id
        ? update
        : bill
    )
  },
  changeStatusFailure (state, { id, error }) {
    console.log('mutation for change status failure committed.')
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map(bill => {
      if (bill.id === id) {
        // make copy of user without 'deleting:true' property
        const { updating, ...billCopy } = bill
        // return copy of user with 'deleteError:[error]' property
        return { ...billCopy, statusUpdate: error }
      }

      return bill
    })
  },
  deleteRequest (state, id) {
    // add 'deleting:true' property to user being deleted
    state.all.items = state.all.items.map(bill =>
      bill.id === id
        ? { ...bill, deleting: true }
        : bill
    )
  },
  deleteSuccess (state, id) {
    console.log('delete successful')
    // remove deleted user from state
    state.all.items = state.all.items.filter(bill => bill.id !== id)
  },
  deleteFailure (state, { id, error }) {
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map(bill => {
      if (bill.id === id) {
        // make copy of user without 'deleting:true' property
        const { deleting, ...billCopy } = bill
        // return copy of user with 'deleteError:[error]' property
        return { ...billCopy, deleteError: error }
      }

      return bill
    })
  }
}

export const bills = {
  namespaced: true,
  state,
  actions,
  mutations
}
